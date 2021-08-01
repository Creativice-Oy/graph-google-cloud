// import { Entity } from '@jupiterone/integration-sdk-core';
import { bigtableadmin_v2 } from 'googleapis';
import { createGoogleCloudIntegrationEntity } from '../../utils/entity';
import { bigTableEntities } from './constants';

// FIX: I like the fact that you went instantly for the types :)
// But in GCP we don't manually build the types as API package returns them to us
// And j1 team is okay with createGoogleCloudIntegrationEntity returning just the Entity (general) type for now
// export interface OperationEntity extends Entity {
//   name: string;
//   projectId: string;
//   done: boolean;
// }

// export interface InstanceEntity extends Entity {
//   name: string;
//   projectId: string;
//   displayName: string;
//   state: string;
//   type: string;
// }

// FIX: slight change in name (not important, just matches better with existing methods)
// FIX: try to refactor buildOperationKey and buildInstanceKey to look more like this
// export function getOperationKey(operation: bigtableadmin_v2.Schema$Operation) {
//   // In general, we don't want to have projectId be part of the keys (all of these ingested entities are underneath some project)
//   // So try to return something like the following instead
//   // I haven't researched bigtable's data format, so I'm not sure if there's uid or some other unique identified (hopefully there is)
//   // E.g. I'm not sure how unique the name is
//   return `bigtable_operation:${uid}`;
// }

export function buildOperationKey({
  operation,
  projectId,
}: {
  operation: bigtableadmin_v2.Schema$Operation;
  projectId: string | undefined | null;
}) {
  return `project:${projectId}|operation:${operation.name}`;

  // In general, we don't want to have projectId be part of the keys (all of these ingested entities are underneath some project)
  // So try to return something like the following instead
  // return `bigtable_operation:${uid}`;

  // I haven't researched bigtable's data format, so I'm not sure if there's uid or some other unique identified (hopefully there is)
  // E.g. I'm not sure how unique the name is
}
export function buildInstanceKey({
  instance,
  projectId,
}: {
  instance: bigtableadmin_v2.Schema$Instance;
  projectId: string | undefined | null;
}) {
  return `project:${projectId}|instance:${instance.name}`;
}

export function createOperationEntity({
  _key,
  operation,
  projectId,
}: {
  _key: string;
  operation: bigtableadmin_v2.Schema$Operation;
  projectId: string | undefined | null;
}) {
  return createGoogleCloudIntegrationEntity(operation, {
    entityData: {
      source: operation,
      assign: {
        _class: bigTableEntities.OPERATIONS._class,
        _type: bigTableEntities.OPERATIONS._type,
        _key,
        // Preferably, we'd want to generate and assign key here
        // _key: getOperationKey(data)
        // That way the step/index.ts doesn't need to worry about the key generation part there
        name: operation.name,
        projectId,
        done: operation.done,
      },
    },
  });
}

export function createInstanceEntity({
  _key,
  instance,
  projectId,
}: {
  _key: string;
  instance: bigtableadmin_v2.Schema$Instance;
  projectId: string | undefined | null;
}) {
  return createGoogleCloudIntegrationEntity(instance, {
    entityData: {
      source: instance,
      assign: {
        _class: bigTableEntities.INSTANCES._class,
        _type: bigTableEntities.INSTANCES._type,
        _key,
        name: instance.name,
        projectId,
        displayName: instance.displayName!,
        state: instance.state,
        type: instance.type,
      },
    },
  });
}
