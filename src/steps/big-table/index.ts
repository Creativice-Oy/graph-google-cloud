import {
  createDirectRelationship,
  IntegrationStep,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../types';
import { BigTableClient } from './client';
import {
  bigTableEntities,
  RELATIONSHIP_TYPE_INSTANCE_HAS_APP_PROFILE,
  STEP_BIG_TABLE_APP_PROFILES,
  STEP_BIG_TABLE_INSTANCES,
  STEP_BIG_TABLE_OPERATIONS,
} from './constants';
import {
  createAppProfileEntity,
  createInstanceEntity,
  createOperationEntity,
} from './converters';

export async function fetchOperations(
  context: IntegrationStepContext,
): Promise<void> {
  const { instance, jobState } = context;
  const client = new BigTableClient({ config: instance.config });
  const projectId = client.projectId;

  await client.iterateOperations(async (operation) => {
    await jobState.addEntity(
      createOperationEntity({
        operation,
        projectId,
      }),
    );
  });
}

export async function fetchInstances(
  context: IntegrationStepContext,
): Promise<void> {
  const { instance, jobState } = context;
  const client = new BigTableClient({ config: instance.config });
  const projectId = client.projectId;

  await client.iterateInstances(async (instance) => {
    await jobState.addEntity(
      createInstanceEntity({
        instance,
        projectId,
      }),
    );
  });
}

export async function fetchAppProfiles(
  context: IntegrationStepContext,
): Promise<void> {
  const { instance, jobState } = context;
  const client = new BigTableClient({ config: instance.config });
  const projectId = client.projectId;

  await jobState.iterateEntities(
    { _type: bigTableEntities.INSTANCES._type },
    async (instanceEntity) => {
      await client.iterateAppProfiles(
        instanceEntity.name as string,
        async (appProfile) => {
          const appProfileEntity = createAppProfileEntity({
            appProfile,
            projectId,
            instanceId: instanceEntity.name as string,
          });

          await jobState.addEntity(appProfileEntity);

          await jobState.addRelationship(
            createDirectRelationship({
              _class: RelationshipClass.HAS,
              from: instanceEntity,
              to: appProfileEntity,
            }),
          );
        },
      );
    },
  );
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
  {
    id: STEP_BIG_TABLE_APP_PROFILES,
    name: 'Bigtable AppProfiles',
    entities: [bigTableEntities.APP_PROFILES],
    relationships: [
      {
        _class: RelationshipClass.HAS,
        _type: RELATIONSHIP_TYPE_INSTANCE_HAS_APP_PROFILE,
        sourceType: bigTableEntities.INSTANCES._type,
        targetType: bigTableEntities.APP_PROFILES._type,
      },
    ],
    dependsOn: [],
    executionHandler: fetchAppProfiles,
  },
];
