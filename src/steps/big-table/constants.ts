export const STEP_BIG_TABLE_OPERATIONS = 'fetch-bigtable-operations';
export const STEP_BIG_TABLE_INSTANCES = 'fetch-bigtable-instances';
export const STEP_BIG_TABLE_APP_PROFILES = 'fetch-bigtable-app-profiles';

export const RELATIONSHIP_TYPE_INSTANCE_HAS_APP_PROFILE =
  'google_bigtable_instance_has_app_profile';

export const bigTableEntities = {
  OPERATIONS: {
    _type: 'google_bigtable_operation',
    _class: ['Task'],
    resourceName: 'Bigtable Operation',
  },
  INSTANCES: {
    _type: 'google_bigtable_instance',
    _class: ['Database'],
    resourceName: 'Bigtable Instance',
  },
  APP_PROFILES: {
    _type: 'google_bigtable_app_profile',
    _class: ['Configuration'],
    resourceName: 'Bigtable AppProfile',
  },
};
