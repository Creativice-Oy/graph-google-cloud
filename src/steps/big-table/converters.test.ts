import { DEFAULT_INTEGRATION_CONFIG_PROJECT_ID } from '../../../test/config';
import {
  getMockBigTableAppProfile,
  getMockBigTableBackup,
  getMockBigTableCluster,
  getMockBigTableInstance,
  getMockBigTableLocation,
  getMockBigTableOperation,
  getMockBigTableTable,
} from '../../../test/mocks';
import {
  createBackupEntity,
  createClusterEntity,
  createInstanceEntity,
  createLocationEntity,
  createOperationEntity,
  createTableEntity,
} from './converters';

describe('#createOperationEntity', () => {
  it('should convert to entity', () => {
    expect(
      createOperationEntity({
        operation: getMockBigTableOperation(),
        projectId: DEFAULT_INTEGRATION_CONFIG_PROJECT_ID,
      }),
    ).toMatchSnapshot();
  });
});

describe('#createInstanceEntity', () => {
  it('should convert to entity', () => {
    expect(
      createInstanceEntity({
        instance: getMockBigTableInstance(),
        projectId: DEFAULT_INTEGRATION_CONFIG_PROJECT_ID,
      }),
    ).toMatchSnapshot();
  });
});

describe('#createAppProfileEntity', () => {
  it('should convert to entity', () => {
    expect(
      createInstanceEntity({
        instance: getMockBigTableAppProfile(),
        projectId: DEFAULT_INTEGRATION_CONFIG_PROJECT_ID,
      }),
    ).toMatchSnapshot();
  });
});

describe('#createClusterEntity', () => {
  it('should convert to entity', () => {
    expect(
      createClusterEntity({
        cluster: getMockBigTableCluster(),
        projectId: DEFAULT_INTEGRATION_CONFIG_PROJECT_ID,
        instanceId: 'mock-instance-id',
      }),
    ).toMatchSnapshot();
  });
});

describe('#createTableEntity', () => {
  it('should convert to entity', () => {
    expect(
      createTableEntity({
        table: getMockBigTableTable(),
        projectId: DEFAULT_INTEGRATION_CONFIG_PROJECT_ID,
        instanceId: 'mock-instance-id',
      }),
    ).toMatchSnapshot();
  });
});

describe('#createBackupEntity', () => {
  it('should convert to entity', () => {
    expect(
      createBackupEntity({
        backup: getMockBigTableBackup(),
        projectId: DEFAULT_INTEGRATION_CONFIG_PROJECT_ID,
        instanceId: 'mock-instance-id',
        clusterId: 'mock-cluster-id',
      }),
    ).toMatchSnapshot();
  });
});

describe('#createLocationEntity', () => {
  it('should convert to entity', () => {
    expect(
      createLocationEntity({
        location: getMockBigTableLocation(),
        projectId: DEFAULT_INTEGRATION_CONFIG_PROJECT_ID,
      }),
    ).toMatchSnapshot();
  });
});
