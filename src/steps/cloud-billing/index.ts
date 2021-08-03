import {
  createDirectRelationship,
  createMappedRelationship,
  IntegrationStep,
  RelationshipClass,
  RelationshipDirection,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../types';
import {
  PROJECT_ENTITY_TYPE,
  STEP_RESOURCE_MANAGER_PROJECT,
} from '../resource-manager';
import { BillingBudgetClient } from './client';
import {
  ENTITY_CLASS_BILLING_BUDGET,
  ENTITY_TYPE_BILLING_BUDGET,
  RELATIONSHIP_TYPE_PROJECT_HAS_BUDGET,
  STEP_BILLING_BUDGET,
  STEP_BUILD_PROJECT_BUDGET,
} from './constants';
import { createBillingBudgetEntity } from './converters';
import { getProjectEntity } from '../../utils/project';

export async function fetchBillingBudget(
  context: IntegrationStepContext,
): Promise<void> {
  const {
    jobState,
    instance: { config },
  } = context;
  const client = new BillingBudgetClient({ config });

  await client.iterateBudgets(async (budget) => {
    await jobState.addEntity(createBillingBudgetEntity(budget));
  });
}

export async function buildProjectBudgetRelationships(
  context: IntegrationStepContext,
): Promise<void> {
  const { jobState } = context;

  const projectEntity = await getProjectEntity(jobState);
  const projectName = projectEntity.name;

  await jobState.iterateEntities(
    {
      _type: ENTITY_TYPE_BILLING_BUDGET,
    },
    async (budgetEntity) => {
      if (budgetEntity.projects) {
        for (const project of budgetEntity.projects as string[]) {
          if (project === projectName) {
            await jobState.addRelationship(
              createDirectRelationship({
                _class: RelationshipClass.HAS,
                from: projectEntity,
                to: budgetEntity,
              }),
            );
          } else {
            await jobState.addRelationship(
              createMappedRelationship({
                _class: RelationshipClass.HAS,
                _type: RELATIONSHIP_TYPE_PROJECT_HAS_BUDGET,
                _mapping: {
                  relationshipDirection: RelationshipDirection.FORWARD,
                  sourceEntityKey: project,
                  targetFilterKeys: [['_type', '_key']],
                  skipTargetCreation: true,
                  targetEntity: {
                    ...budgetEntity,
                    _rawData: undefined,
                  },
                },
              }),
            );
          }
        }
      } else {
        // Todo: Extend budget to all projects on scope
        await jobState.addRelationship(
          createDirectRelationship({
            _class: RelationshipClass.HAS,
            from: projectEntity,
            to: budgetEntity,
          }),
        );
      }
    },
  );
}

export const cloudBillingSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: STEP_BILLING_BUDGET,
    name: 'Billing Budget',
    entities: [
      {
        resourceName: 'Billing Budget',
        _type: ENTITY_TYPE_BILLING_BUDGET,
        _class: ENTITY_CLASS_BILLING_BUDGET,
      },
    ],
    relationships: [],
    dependsOn: [STEP_RESOURCE_MANAGER_PROJECT],
    executionHandler: fetchBillingBudget,
  },
  {
    id: STEP_BUILD_PROJECT_BUDGET,
    name: 'Build Project Budget',
    entities: [],
    relationships: [
      {
        _class: RelationshipClass.HAS,
        _type: RELATIONSHIP_TYPE_PROJECT_HAS_BUDGET,
        sourceType: PROJECT_ENTITY_TYPE,
        targetType: ENTITY_TYPE_BILLING_BUDGET,
      },
    ],
    dependsOn: [STEP_BILLING_BUDGET, STEP_RESOURCE_MANAGER_PROJECT],
    executionHandler: buildProjectBudgetRelationships,
  },
];
