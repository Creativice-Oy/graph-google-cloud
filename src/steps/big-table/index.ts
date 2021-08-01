import { IntegrationStep } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../types';
import { BigTableClient } from './client';
import {
  bigTableEntities,
  STEP_BIG_TABLE_INSTANCES,
  STEP_BIG_TABLE_OPERATIONS,
} from './constants';
import {
  buildInstanceKey,
  buildOperationKey,
  createInstanceEntity,
  createOperationEntity,
} from './converters';

export async function fetchOperations(
  context: IntegrationStepContext,
): Promise<void> {
  const { instance, jobState } = context;
  const client = new BigTableClient({ config: instance.config });
  // FIX: it's best to access the projectId by using the following
  // client.projectId (existing code always uses this pattern)
  // const projectId = instance.config.projectId;
  const projectId = client.projectId;

  // FIX: by default we don't use try/catch here always
  // Errors handling happen somewhere above this
  // However there are times where we want to handle some step-specific errors more precisely
  // And then we use the try/catch in the steps (you can take a look at existing code)
  try {
    await client.iterateOperations(async (operation) => {
      const _key = buildOperationKey({ operation, projectId });

      await jobState.addEntity(
        createOperationEntity({
          _key,
          operation,
          projectId,
        }),
      );
    });
  } catch (error) {
    console.log(error);
  }
}

export async function fetchInstances(
  context: IntegrationStepContext,
): Promise<void> {
  const { instance, jobState } = context;
  const client = new BigTableClient({ config: instance.config });
  // FIX: it's best to access the projectId by using the following
  // client.projectId (existing code always uses this pattern)
  // const projectId = instance.config.projectId;
  const projectId = client.projectId;

  try {
    await client.iterateInstances(async (instance) => {
      const _key = buildInstanceKey({ instance, projectId });

      await jobState.addEntity(
        createInstanceEntity({
          _key,
          instance,
          projectId,
        }),
      );
    });
  } catch (error) {
    console.log(error);
  }
}

export const bigTableSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: STEP_BIG_TABLE_OPERATIONS,
    name: 'Bigtable Operations',
    entities: [bigTableEntities.OPERATIONS],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchOperations,
  },
  {
    id: STEP_BIG_TABLE_INSTANCES,
    name: 'Bigtable Instances',
    entities: [bigTableEntities.INSTANCES],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchInstances,
  },
];
