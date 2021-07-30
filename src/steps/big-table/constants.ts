export const STEP_BIG_TABLE_OPERATIONS = 'fetch-bigtable-operations';
export const STEP_BIG_TABLE_INSTANCES = 'fetch-bigtable-instances';

export const bigTableEntities = {
  OPERATIONS: {
    _type: 'google_cloud_bigtable_operation',
    _class: ['Task'],
    resourceName: 'Bigtable Operation',
  },
  INSTANCES: {
    _type: 'google_cloud_bigtable_instance',
    _class: ['Database'],
    resourceName: 'Bigtable Instance',
  },
};
