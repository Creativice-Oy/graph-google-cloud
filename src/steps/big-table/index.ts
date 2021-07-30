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
  const projectId = instance.config.projectId;
  try {
    await client.iterateOperations(context, async (operation) => {
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
  const projectId = instance.config.projectId;
  try {
    await client.iterateInstances(context, async (instance) => {
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
