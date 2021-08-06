import {
  createDirectRelationship,
  IntegrationStep,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../types';
import { BigTableClient } from './client';
import {
  ENTITY_CLASS_BIG_TABLE_APP_PROFILE,
  ENTITY_CLASS_BIG_TABLE_BACKUP,
  ENTITY_CLASS_BIG_TABLE_CLUSTER,
  ENTITY_CLASS_BIG_TABLE_INSTANCE,
  ENTITY_CLASS_BIG_TABLE_LOCATION,
  ENTITY_CLASS_BIG_TABLE_OPERATION,
  ENTITY_CLASS_BIG_TABLE_TABLE,
  ENTITY_TYPE_BIG_TABLE_APP_PROFILE,
  ENTITY_TYPE_BIG_TABLE_BACKUP,
  ENTITY_TYPE_BIG_TABLE_CLUSTER,
  ENTITY_TYPE_BIG_TABLE_INSTANCE,
  ENTITY_TYPE_BIG_TABLE_LOCATION,
  ENTITY_TYPE_BIG_TABLE_OPERATION,
  ENTITY_TYPE_BIG_TABLE_TABLE,
  RELATIONSHIP_TYPE_CLUSTER_HAS_BACKUP,
  RELATIONSHIP_TYPE_INSTANCE_HAS_APP_PROFILE,
  RELATIONSHIP_TYPE_INSTANCE_HAS_CLUSTER,
  RELATIONSHIP_TYPE_INSTANCE_HAS_TABLE,
  STEP_BIG_TABLE_APP_PROFILES,
  STEP_BIG_TABLE_BACKUPS,
  STEP_BIG_TABLE_CLUSTERS,
  STEP_BIG_TABLE_INSTANCES,
  STEP_BIG_TABLE_LOCATIONS,
  STEP_BIG_TABLE_OPERATIONS,
  STEP_BIG_TABLE_TABLES,
} from './constants';
import {
  createAppProfileEntity,
  createBackupEntity,
  createClusterEntity,
  createInstanceEntity,
  createLocationEntity,
  createOperationEntity,
  createTableEntity,
} from './converters';

export async function fetchOperations(
  context: IntegrationStepContext,
): Promise<void> {
  const { instance, jobState } = context;
  const client = new BigTableClient({ config: instance.config });

  await client.iterateOperations(async (operation) => {
    await jobState.addEntity(
      createOperationEntity({
        operation,
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
    { _type: ENTITY_TYPE_BIG_TABLE_INSTANCE },
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

export async function fetchClusters(
  context: IntegrationStepContext,
): Promise<void> {
  const { instance, jobState } = context;
  const client = new BigTableClient({ config: instance.config });
  const projectId = client.projectId;

  await jobState.iterateEntities(
    { _type: ENTITY_TYPE_BIG_TABLE_INSTANCE },
    async (instanceEntity) => {
      await client.iterateClusters(
        instanceEntity.name as string,
        async (cluster) => {
          const clusterEntity = createClusterEntity({
            cluster,
            projectId,
            instanceId: instanceEntity.name as string,
          });

          await jobState.addEntity(clusterEntity);

          await jobState.addRelationship(
            createDirectRelationship({
              _class: RelationshipClass.HAS,
              from: instanceEntity,
              to: clusterEntity,
            }),
          );
        },
      );
    },
  );
}

export async function fetchBackups(
  context: IntegrationStepContext,
): Promise<void> {
  const { instance, jobState } = context;
  const client = new BigTableClient({ config: instance.config });
  const projectId = client.projectId;

  await jobState.iterateEntities(
    { _type: ENTITY_TYPE_BIG_TABLE_CLUSTER },
    async (clusterEntity) => {
      await client.iterateBackups(
        clusterEntity.instanceId as string,
        clusterEntity.name as string,
        async (backup) => {
          const backupEntity = createBackupEntity({
            backup,
            projectId,
            instanceId: clusterEntity.instanceId as string,
            clusterId: clusterEntity.name as string,
          });

          await jobState.addEntity(backupEntity);

          await jobState.addRelationship(
            createDirectRelationship({
              _class: RelationshipClass.HAS,
              from: clusterEntity,
              to: backupEntity,
            }),
          );
        },
      );
    },
  );
}

export async function fetchTables(
  context: IntegrationStepContext,
): Promise<void> {
  const { instance, jobState } = context;
  const client = new BigTableClient({ config: instance.config });
  const projectId = client.projectId;

  await jobState.iterateEntities(
    { _type: ENTITY_TYPE_BIG_TABLE_INSTANCE },
    async (instanceEntity) => {
      await client.iterateTables(
        instanceEntity.name as string,
        async (table) => {
          const tableEntity = createTableEntity({
            table,
            projectId,
            instanceId: instanceEntity.name as string,
          });

          await jobState.addEntity(tableEntity);

          await jobState.addRelationship(
            createDirectRelationship({
              _class: RelationshipClass.HAS,
              from: instanceEntity,
              to: tableEntity,
            }),
          );
        },
      );
    },
  );
}

export async function fetchLocations(
  context: IntegrationStepContext,
): Promise<void> {
  const { instance, jobState } = context;
  const client = new BigTableClient({ config: instance.config });

  await client.iterateLocations(async (location) => {
    await jobState.addEntity(
      createLocationEntity({
        location,
      }),
    );
  });
}

export const bigTableSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: STEP_BIG_TABLE_OPERATIONS,
    name: 'Bigtable Operations',
    entities: [
      {
        _class: ENTITY_CLASS_BIG_TABLE_OPERATION,
        _type: ENTITY_TYPE_BIG_TABLE_OPERATION,
        resourceName: 'Bigtable Operation',
      },
    ],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchOperations,
  },
  {
    id: STEP_BIG_TABLE_INSTANCES,
    name: 'Bigtable Instances',
    entities: [
      {
        _class: ENTITY_CLASS_BIG_TABLE_INSTANCE,
        _type: ENTITY_TYPE_BIG_TABLE_INSTANCE,
        resourceName: 'Bigtable Instance',
      },
    ],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchInstances,
  },
  {
    id: STEP_BIG_TABLE_APP_PROFILES,
    name: 'Bigtable AppProfiles',
    entities: [
      {
        _class: ENTITY_CLASS_BIG_TABLE_APP_PROFILE,
        _type: ENTITY_TYPE_BIG_TABLE_APP_PROFILE,
        resourceName: 'Bigtable AppProfile',
      },
    ],
    relationships: [
      {
        _class: RelationshipClass.HAS,
        _type: RELATIONSHIP_TYPE_INSTANCE_HAS_APP_PROFILE,
        sourceType: ENTITY_TYPE_BIG_TABLE_INSTANCE,
        targetType: ENTITY_TYPE_BIG_TABLE_APP_PROFILE,
      },
    ],
    dependsOn: [STEP_BIG_TABLE_INSTANCES],
    executionHandler: fetchAppProfiles,
  },
  {
    id: STEP_BIG_TABLE_CLUSTERS,
    name: 'Bigtable Clusters',
    entities: [
      {
        _class: ENTITY_CLASS_BIG_TABLE_CLUSTER,
        _type: ENTITY_TYPE_BIG_TABLE_CLUSTER,
        resourceName: 'Bigtable Cluster',
      },
    ],
    relationships: [
      {
        _class: RelationshipClass.HAS,
        _type: RELATIONSHIP_TYPE_INSTANCE_HAS_CLUSTER,
        sourceType: ENTITY_TYPE_BIG_TABLE_INSTANCE,
        targetType: ENTITY_TYPE_BIG_TABLE_CLUSTER,
      },
    ],
    dependsOn: [STEP_BIG_TABLE_INSTANCES],
    executionHandler: fetchClusters,
  },
  {
    id: STEP_BIG_TABLE_BACKUPS,
    name: 'Bigtable Backups',
    entities: [
      {
        _class: ENTITY_CLASS_BIG_TABLE_BACKUP,
        _type: ENTITY_TYPE_BIG_TABLE_BACKUP,
        resourceName: 'Bigtable Backup',
      },
    ],
    relationships: [
      {
        _class: RelationshipClass.HAS,
        _type: RELATIONSHIP_TYPE_CLUSTER_HAS_BACKUP,
        sourceType: ENTITY_TYPE_BIG_TABLE_CLUSTER,
        targetType: ENTITY_TYPE_BIG_TABLE_BACKUP,
      },
    ],
    dependsOn: [STEP_BIG_TABLE_CLUSTERS, STEP_BIG_TABLE_INSTANCES],
    executionHandler: fetchBackups,
  },
  {
    id: STEP_BIG_TABLE_TABLES,
    name: 'Bigtable Tables',
    entities: [
      {
        _class: ENTITY_CLASS_BIG_TABLE_TABLE,
        _type: ENTITY_TYPE_BIG_TABLE_TABLE,
        resourceName: 'Bigtable Table',
      },
    ],
    relationships: [
      {
        _class: RelationshipClass.HAS,
        _type: RELATIONSHIP_TYPE_INSTANCE_HAS_TABLE,
        sourceType: ENTITY_TYPE_BIG_TABLE_INSTANCE,
        targetType: ENTITY_TYPE_BIG_TABLE_TABLE,
      },
    ],
    dependsOn: [STEP_BIG_TABLE_INSTANCES],
    executionHandler: fetchTables,
  },
  {
    id: STEP_BIG_TABLE_LOCATIONS,
    name: 'Bigtable Locations',
    entities: [
      {
        _class: ENTITY_CLASS_BIG_TABLE_LOCATION,
        _type: ENTITY_TYPE_BIG_TABLE_LOCATION,
        resourceName: 'Bigtable Location',
      },
    ],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchLocations,
  },
];
