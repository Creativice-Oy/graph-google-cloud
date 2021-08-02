import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import {
  fetchAppProfiles,
  fetchBackups,
  fetchClusters,
  fetchInstances,
  fetchOperations,
  fetchTables,
} from '.';
import { integrationConfig } from '../../../test/config';
import { setupGoogleCloudRecording } from '../../../test/recording';
import { IntegrationConfig } from '../../types';
import {
  bigTableEntities,
  RELATIONSHIP_TYPE_CLUSTER_HAS_BACKUP,
  RELATIONSHIP_TYPE_INSTANCE_HAS_APP_PROFILE,
  RELATIONSHIP_TYPE_INSTANCE_HAS_CLUSTER,
  RELATIONSHIP_TYPE_INSTANCE_HAS_TABLE,
} from './constants';

describe('#fetchOperations', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupGoogleCloudRecording({
      directory: __dirname,
      name: 'fetchOperations',
    });
  });

  afterEach(async () => {
    await recording.stop();
  });

  test('should collect data', async () => {
    const context = createMockStepExecutionContext<IntegrationConfig>({
      instanceConfig: integrationConfig,
    });

    await fetchOperations(context);

    expect({
      numCollectedEntities: context.jobState.collectedEntities.length,
      numCollectedRelationships: context.jobState.collectedRelationships.length,
      collectedEntities: context.jobState.collectedEntities,
      collectedRelationships: context.jobState.collectedRelationships,
      encounteredTypes: context.jobState.encounteredTypes,
    }).toMatchSnapshot();

    expect(
      context.jobState.collectedEntities.filter(
        (e) => e.type === bigTableEntities.OPERATIONS._type,
      ),
    ).toMatchGraphObjectSchema({
      _class: ['Task'],
      schema: {
        additionalProperties: false,
        properties: {
          _type: { const: 'google_bigtable_operation' },
          name: { type: 'string' },
          projectId: { type: 'string' },
          done: { type: 'boolean' },
        },
      },
    });
  });
});

describe('#fetchInstances', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupGoogleCloudRecording({
      directory: __dirname,
      name: 'fetchInstances',
    });
  });

  afterEach(async () => {
    await recording.stop();
  });

  test('should collect data', async () => {
    const context = createMockStepExecutionContext<IntegrationConfig>({
      instanceConfig: integrationConfig,
    });

    await fetchInstances(context);

    expect({
      numCollectedEntities: context.jobState.collectedEntities.length,
      numCollectedRelationships: context.jobState.collectedRelationships.length,
      collectedEntities: context.jobState.collectedEntities,
      collectedRelationships: context.jobState.collectedRelationships,
      encounteredTypes: context.jobState.encounteredTypes,
    }).toMatchSnapshot();

    expect(
      context.jobState.collectedEntities.filter(
        (e) => e.type === bigTableEntities.INSTANCES._type,
      ),
    ).toMatchGraphObjectSchema({
      _class: ['Database'],
      schema: {
        additionalProperties: false,
        properties: {
          _type: { const: 'google_bigtable_instance' },
          name: { type: 'string' },
          projectId: { type: 'string' },
          state: { type: 'string' },
          type: { type: 'string' },
        },
      },
    });
  });
});

describe('#fetchAppProfiles', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupGoogleCloudRecording({
      directory: __dirname,
      name: 'fetchAppProfiles',
    });
  });

  afterEach(async () => {
    await recording.stop();
  });

  test('should collect data', async () => {
    const context = createMockStepExecutionContext<IntegrationConfig>({
      instanceConfig: integrationConfig,
    });

    await fetchAppProfiles(context);

    expect({
      numCollectedEntities: context.jobState.collectedEntities.length,
      numCollectedRelationships: context.jobState.collectedRelationships.length,
      collectedEntities: context.jobState.collectedEntities,
      collectedRelationships: context.jobState.collectedRelationships,
      encounteredTypes: context.jobState.encounteredTypes,
    }).toMatchSnapshot();

    expect(
      context.jobState.collectedEntities.filter(
        (e) => e.type === bigTableEntities.APP_PROFILES._type,
      ),
    ).toMatchGraphObjectSchema({
      _class: ['Configuration'],
      schema: {
        additionalProperties: false,
        properties: {
          _type: { const: 'google_bigtable_app_profile' },
          name: { type: 'string' },
          instanceId: { type: 'string' },
          projectId: { type: 'string' },
          etag: { type: 'string' },
          description: { type: 'string' },
        },
      },
    });

    expect(
      context.jobState.collectedRelationships.filter(
        (e) => e._type === RELATIONSHIP_TYPE_INSTANCE_HAS_APP_PROFILE,
      ),
    ).toMatchDirectRelationshipSchema({
      schema: {
        properties: {
          _class: { const: 'HAS' },
          _type: {
            const: 'google_bigtable_instance_has_app_profile',
          },
        },
      },
    });
  });
});

describe('#fetchClusters', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupGoogleCloudRecording({
      directory: __dirname,
      name: 'fetchClusters',
    });
  });

  afterEach(async () => {
    await recording.stop();
  });

  test('should collect data', async () => {
    const context = createMockStepExecutionContext<IntegrationConfig>({
      instanceConfig: integrationConfig,
    });

    await fetchClusters(context);

    expect({
      numCollectedEntities: context.jobState.collectedEntities.length,
      numCollectedRelationships: context.jobState.collectedRelationships.length,
      collectedEntities: context.jobState.collectedEntities,
      collectedRelationships: context.jobState.collectedRelationships,
      encounteredTypes: context.jobState.encounteredTypes,
    }).toMatchSnapshot();

    expect(
      context.jobState.collectedEntities.filter(
        (e) => e.type === bigTableEntities.CLUSTERS._type,
      ),
    ).toMatchGraphObjectSchema({
      _class: ['Cluster'],
      schema: {
        additionalProperties: false,
        properties: {
          _type: { const: 'google_bigtable_cluster' },
          name: { type: 'string' },
          projectId: { type: 'string' },
          instanceId: { type: 'string' },
          state: { type: 'string' },
          location: { type: 'string' },
          defaultStorageType: { type: 'string' },
          serveNodes: { type: 'number' },
          kmsKeyName: { type: 'string' },
        },
      },
    });

    expect(
      context.jobState.collectedRelationships.filter(
        (e) => e._type === RELATIONSHIP_TYPE_INSTANCE_HAS_CLUSTER,
      ),
    ).toMatchDirectRelationshipSchema({
      schema: {
        properties: {
          _class: { const: 'HAS' },
          _type: {
            const: 'google_bigtable_instance_has_cluster',
          },
        },
      },
    });
  });
});

describe('#fetchBackups', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupGoogleCloudRecording({
      directory: __dirname,
      name: 'fetchBackups',
    });
  });

  afterEach(async () => {
    await recording.stop();
  });

  test('should collect data', async () => {
    const context = createMockStepExecutionContext<IntegrationConfig>({
      instanceConfig: integrationConfig,
    });

    await fetchBackups(context);

    expect({
      numCollectedEntities: context.jobState.collectedEntities.length,
      numCollectedRelationships: context.jobState.collectedRelationships.length,
      collectedEntities: context.jobState.collectedEntities,
      collectedRelationships: context.jobState.collectedRelationships,
      encounteredTypes: context.jobState.encounteredTypes,
    }).toMatchSnapshot();

    expect(
      context.jobState.collectedEntities.filter(
        (e) => e.type === bigTableEntities.BACKUPS._type,
      ),
    ).toMatchGraphObjectSchema({
      _class: ['Backup'],
      schema: {
        additionalProperties: false,
        properties: {
          _type: { const: 'google_bigtable_backup' },
          name: { type: 'string' },
          projectId: { type: 'string' },
          instanceId: { type: 'string' },
          clusterId: { type: 'string' },
          sourceTable: { type: 'string' },
          expireTime: { type: 'string' },
          startTime: { type: 'string' },
          endTime: { type: 'string' },
          sizeBytes: { type: 'string' },
          state: { type: 'string' },
          encryptionType: { type: 'string' },
          kmsKeyVersion: { type: 'string' },
        },
      },
    });

    expect(
      context.jobState.collectedRelationships.filter(
        (e) => e._type === RELATIONSHIP_TYPE_CLUSTER_HAS_BACKUP,
      ),
    ).toMatchDirectRelationshipSchema({
      schema: {
        properties: {
          _class: { const: 'HAS' },
          _type: {
            const: 'google_bigtable_cluster_has_backup',
          },
        },
      },
    });
  });
});

describe('#fetchTables', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupGoogleCloudRecording({
      directory: __dirname,
      name: 'fetchTables',
    });
  });

  afterEach(async () => {
    await recording.stop();
  });

  test('should collect data', async () => {
    const context = createMockStepExecutionContext<IntegrationConfig>({
      instanceConfig: integrationConfig,
    });

    await fetchTables(context);

    expect({
      numCollectedEntities: context.jobState.collectedEntities.length,
      numCollectedRelationships: context.jobState.collectedRelationships.length,
      collectedEntities: context.jobState.collectedEntities,
      collectedRelationships: context.jobState.collectedRelationships,
      encounteredTypes: context.jobState.encounteredTypes,
    }).toMatchSnapshot();

    expect(
      context.jobState.collectedEntities.filter(
        (e) => e.type === bigTableEntities.TABLES._type,
      ),
    ).toMatchGraphObjectSchema({
      _class: ['DataCollection'],
      schema: {
        additionalProperties: false,
        properties: {
          _type: { const: 'google_bigtable_table' },
          name: { type: 'string' },
          projectId: { type: 'string' },
          instanceId: { type: 'string' },
          granularity: { type: 'string' },
          backup: { type: 'string' },
        },
      },
    });

    expect(
      context.jobState.collectedRelationships.filter(
        (e) => e._type === RELATIONSHIP_TYPE_CLUSTER_HAS_BACKUP,
      ),
    ).toMatchDirectRelationshipSchema({
      schema: {
        properties: {
          _class: { const: 'HAS' },
          _type: {
            const: 'google_bigtable_instance_has_table',
          },
        },
      },
    });
  });
});
