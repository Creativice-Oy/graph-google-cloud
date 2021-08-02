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
      console.log('budgetEntity', budgetEntity);
      // FIX: I don't think budgetEntity.project exists
      // Did you mean budgetEntity.projects?
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
                  // FIX: this should have key of each projects in that array (from the loop)
                  // Right now this will just make connection between the current project and the budget
                  // OLD: sourceEntityKey: projectEntity._key,
                  // Luckily the project's key fits this mold: _key: 'projects/167984947943',
                  // So we can just use the content from the 'project' var
                  sourceEntityKey: project,
                  targetFilterKeys: [['_type', '_key']],
                  skipTargetCreation: true,
                  targetEntity: {
                    // _type: ENTITY_TYPE_BILLING_BUDGET,
                    // _key: budgetEntity._key,
                    // Since we already have budgetEntity built, we can just pass it here
                    ...budgetEntity,
                    // We however don't want rawData in these mapped relationships
                    _rawData: undefined,
                  },
                },
              }),
            );
          }
        }
      } else {
        // no budgetEntity.project means budget applies to all projects
        // This is tricky...
        // We could have a util function that stores all the traversed projects in some list (jobState.setData)
        // In here: buildOrgFolderProjectMappedRelationships (search for that)
        // However, whenever I create a new budget, if I want to leave all projects be selected the UI mentions (4/4 selected)
        // Meanwhile there are a lot more projects in the jupiterone.dev organization
        // So if we were to do this, we'd wrongly create multiple relationships :/
        // Spend very small amount of time trying to see if there's any requirement for a project to be selectable for the budget
        // If we figure out the criteria we might be able to narrow it down, but even without this case we're probably good to go
        // for a first PR version
        // Just clean up all of these comments once you've read them :)
        // await jobState.addRelationship(
        //   createDirectRelationship({
        //     _class: RelationshipClass.HAS,
        //     from: projectEntity,
        //     to: budgetEntity,
        //   }),
        // );
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
