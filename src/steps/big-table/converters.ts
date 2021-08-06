// import { Entity } from '@jupiterone/integration-sdk-core';
import { bigtableadmin_v2 } from 'googleapis';
import { createGoogleCloudIntegrationEntity } from '../../utils/entity';
import { getGoogleCloudConsoleWebLink } from '../../utils/url';
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
} from './constants';

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

export function getBackupKey(backup: bigtableadmin_v2.Schema$Backup) {
  return `bigtable_backup:${backup.name}`;
}

export function getTableKey(table: bigtableadmin_v2.Schema$Table) {
  return `bigtable_table:${table.name}`;
}

export function getLocationKey(location: bigtableadmin_v2.Schema$Location) {
  return `bigtable_location:${location.locationId}`;
}

export function createOperationEntity({
  operation,
}: {
  operation: bigtableadmin_v2.Schema$Operation;
}) {
  return createGoogleCloudIntegrationEntity(operation, {
    entityData: {
      source: operation,
      assign: {
        _class: ENTITY_CLASS_BIG_TABLE_OPERATION,
        _type: ENTITY_TYPE_BIG_TABLE_OPERATION,
        _key: getOperationKey(operation),
        name: operation.name,
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
        _class: ENTITY_CLASS_BIG_TABLE_INSTANCE,
        _type: ENTITY_TYPE_BIG_TABLE_INSTANCE,
        _key: getInstanceKey(instance),
        name: instance.name,
        displayName: instance.displayName!,
        state: instance.state,
        type: instance.type,
        webLink: getGoogleCloudConsoleWebLink(
          `/bigtable/instances/${instance.name}/overview?project=${projectId}`,
        ),
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
        _class: ENTITY_CLASS_BIG_TABLE_APP_PROFILE,
        _type: ENTITY_TYPE_BIG_TABLE_APP_PROFILE,
        _key: getAppProfileKey(appProfile),
        name: appProfile.name,
        instanceId,
        etag: appProfile.etag,
        description: appProfile.description,
        webLink: getGoogleCloudConsoleWebLink(
          `/bigtable/instances/${instanceId}/app-profiles/${appProfile.name}?project=${projectId}`,
        ),
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
        _class: ENTITY_CLASS_BIG_TABLE_CLUSTER,
        _type: ENTITY_TYPE_BIG_TABLE_CLUSTER,
        _key: getClusterKey(cluster),
        name: cluster.name,
        instanceId,
        state: cluster.state,
        serveNodes: cluster.serveNodes,
        defaultStorageType: cluster.defaultStorageType,
        location: cluster.location,
        kmsKeyName: cluster.encryptionConfig?.kmsKeyName,
        webLink: getGoogleCloudConsoleWebLink(
          `/bigtable/instances/${instanceId}/overview?project=${projectId}`,
        ),
      },
    },
  });
}

export function createBackupEntity({
  backup,
  projectId,
  instanceId,
  clusterId,
}: {
  backup: bigtableadmin_v2.Schema$Backup;
  projectId: string | undefined | null;
  instanceId: string | undefined | null;
  clusterId: string | undefined | null;
}) {
  return createGoogleCloudIntegrationEntity(backup, {
    entityData: {
      source: backup,
      assign: {
        _class: ENTITY_CLASS_BIG_TABLE_BACKUP,
        _type: ENTITY_TYPE_BIG_TABLE_BACKUP,
        _key: getBackupKey(backup),
        name: backup.name,
        instanceId,
        clusterId,
        sourceTable: backup.sourceTable,
        expireTime: backup.expireTime,
        startTime: backup.startTime,
        endTime: backup.endTime,
        sizeBytes: backup.sizeBytes,
        state: backup.state,
        encryptionType: backup.encryptionInfo?.encryptionType,
        kmsKeyVersion: backup.encryptionInfo?.kmsKeyVersion,
        webLink: getGoogleCloudConsoleWebLink(
          `/bigtable/instances/${instanceId}/backups?project=${projectId}`,
        ),
      },
    },
  });
}

export function createTableEntity({
  table,
  projectId,
  instanceId,
}: {
  table: bigtableadmin_v2.Schema$Table;
  projectId: string | undefined | null;
  instanceId: string | undefined | null;
}) {
  return createGoogleCloudIntegrationEntity(table, {
    entityData: {
      source: table,
      assign: {
        _class: ENTITY_CLASS_BIG_TABLE_TABLE,
        _type: ENTITY_TYPE_BIG_TABLE_TABLE,
        _key: getTableKey(table),
        name: table.name,
        classification: 'unclassified', // not sure what to put here. this is a required field for the class DataCollection
        instanceId,
        granularity: table.granularity || undefined, // these value are there in the type definition in the docs, but are not being sent by the API. we're only getting the name
        sourceType: table.restoreInfo?.sourceType || undefined,
        backup: table.restoreInfo?.backupInfo?.backup || undefined,
        webLink: getGoogleCloudConsoleWebLink(
          `/bigtable/instances/${instanceId}/tables?project=${projectId}`,
        ),
      },
    },
  });
}

export function createLocationEntity({
  location,
}: {
  location: bigtableadmin_v2.Schema$Location;
}) {
  return createGoogleCloudIntegrationEntity(location, {
    entityData: {
      source: location,
      assign: {
        _class: ENTITY_CLASS_BIG_TABLE_LOCATION,
        _type: ENTITY_TYPE_BIG_TABLE_LOCATION,
        _key: getLocationKey(location),
        name: location.name,
        locationId: location.locationId,
        displayName: location.displayName || undefined,
      },
    },
  });
}
