import {
  createDirectRelationship,
  IntegrationStep,
  RelationshipClass,
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
  console.log('projectName', projectName);

  await jobState.iterateEntities(
    {
      _type: ENTITY_TYPE_BILLING_BUDGET,
    },
    async (budgetEntity) => {
      console.log('budgetEntity', budgetEntity);
      if (budgetEntity.project) {
        for (const project of budgetEntity.projects as string[]) {
          if (project === projectName) {
            await jobState.addRelationship(
              createDirectRelationship({
                _class: RelationshipClass.HAS,
                from: projectEntity,
                to: budgetEntity,
              }),
            );
          }
        }
      } else {
        // no budgetEntity.project means budget applies to all projects
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
    dependsOn: [],
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
