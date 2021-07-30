import { Entity } from '@jupiterone/integration-sdk-core';
import { bigtableadmin_v2 } from 'googleapis';
import { createGoogleCloudIntegrationEntity } from '../../utils/entity';
import { bigTableEntities } from './constants';

export interface OperationEntity extends Entity {
  name: string;
  projectId: string;
  done: boolean;
}

export interface InstanceEntity extends Entity {
  name: string;
  projectId: string;
  displayName: string;
  state: string;
  type: string;
}

export function buildOperationKey({
  operation,
  projectId,
}: {
  operation: bigtableadmin_v2.Schema$Operation;
  projectId: string | undefined | null;
}) {
  return `project:${projectId}|operation:${operation.name}`;
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
        name: operation.name,
        projectId,
        done: operation.done,
      },
    },
  }) as OperationEntity;
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
  }) as InstanceEntity;
}
