// import { Entity } from '@jupiterone/integration-sdk-core';
import { bigtableadmin_v2 } from 'googleapis';
import { createGoogleCloudIntegrationEntity } from '../../utils/entity';
import { bigTableEntities } from './constants';

export function getOperationKey(operation: bigtableadmin_v2.Schema$Operation) {
  return `bigtable_operation:${operation.name}`;
}

export function getInstanceKey(instance: bigtableadmin_v2.Schema$Instance) {
  return `bigtable_instance:${instance.name}`;
}

export function getAppProfileKey(
  appProfile: bigtableadmin_v2.Schema$AppProfile,
) {
  return `bigtable_appProfile:${appProfile.name}`;
}

export function getClusterKey(cluster: bigtableadmin_v2.Schema$Cluster) {
  return `bigtable_cluster:${cluster.name}`;
}

export function createOperationEntity({
  operation,
  projectId,
}: {
  operation: bigtableadmin_v2.Schema$Operation;
  projectId: string | undefined | null;
}) {
  return createGoogleCloudIntegrationEntity(operation, {
    entityData: {
      source: operation,
      assign: {
        _class: bigTableEntities.OPERATIONS._class,
        _type: bigTableEntities.OPERATIONS._type,
        _key: getOperationKey(operation),
        name: operation.name,
        projectId,
        done: operation.done,
      },
    },
  });
}

export function createInstanceEntity({
  instance,
  projectId,
}: {
  instance: bigtableadmin_v2.Schema$Instance;
  projectId: string | undefined | null;
}) {
  return createGoogleCloudIntegrationEntity(instance, {
    entityData: {
      source: instance,
      assign: {
        _class: bigTableEntities.INSTANCES._class,
        _type: bigTableEntities.INSTANCES._type,
        _key: getInstanceKey(instance),
        name: instance.name,
        projectId,
        displayName: instance.displayName!,
        state: instance.state,
        type: instance.type,
      },
    },
  });
}

export function createAppProfileEntity({
  appProfile,
  projectId,
  instanceId,
}: {
  appProfile: bigtableadmin_v2.Schema$AppProfile;
  projectId: string | undefined | null;
  instanceId: string | undefined | null;
}) {
  return createGoogleCloudIntegrationEntity(appProfile, {
    entityData: {
      source: appProfile,
      assign: {
        _class: bigTableEntities.APP_PROFILES._class,
        _type: bigTableEntities.APP_PROFILES._type,
        _key: getAppProfileKey(appProfile),
        name: appProfile.name,
        projectId,
        instanceId,
        etag: appProfile.etag,
        description: appProfile.description,
      },
    },
  });
}

export function createClusterEntity({
  cluster,
  projectId,
  instanceId,
}: {
  cluster: bigtableadmin_v2.Schema$Cluster;
  projectId: string | undefined | null;
  instanceId: string | undefined | null;
}) {
  return createGoogleCloudIntegrationEntity(cluster, {
    entityData: {
      source: cluster,
      assign: {
        _class: bigTableEntities.CLUSTERS._class,
        _type: bigTableEntities.CLUSTERS._type,
        _key: getClusterKey(cluster),
        name: cluster.name,
        projectId,
        instanceId,
        state: cluster.state,
        serveNodes: cluster.serveNodes,
        defaultStorageType: cluster.defaultStorageType,
        location: cluster.location,
        kmsKeyName: cluster.encryptionConfig?.kmsKeyName,
      },
    },
  });
}
