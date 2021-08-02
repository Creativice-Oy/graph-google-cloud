export const STEP_BIG_TABLE_OPERATIONS = 'fetch-bigtable-operations';
export const STEP_BIG_TABLE_INSTANCES = 'fetch-bigtable-instances';
export const STEP_BIG_TABLE_APP_PROFILES = 'fetch-bigtable-app-profiles';
export const STEP_BIG_TABLE_CLUSTERS = 'fetch-bigtable-clusters';
export const STEP_BIG_TABLE_BACKUPS = 'fetch-bigtable-backups';
export const STEP_BIG_TABLE_TABLES = 'fetch-bigtable-tables';
export const STEP_BIG_TABLE_LOCATIONS = 'fetch-bigtable-locations';

export const RELATIONSHIP_TYPE_INSTANCE_HAS_APP_PROFILE =
  'google_bigtable_instance_has_app_profile';

export const RELATIONSHIP_TYPE_INSTANCE_HAS_CLUSTER =
  'google_bigtable_instance_has_cluster';

export const RELATIONSHIP_TYPE_CLUSTER_HAS_BACKUP =
  'google_bigtable_cluster_has_backup';

export const RELATIONSHIP_TYPE_INSTANCE_HAS_TABLE =
  'google_bigtable_instance_has_table';

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
  CLUSTERS: {
    _type: 'google_bigtable_cluster',
    _class: ['Cluster'],
    resourceName: 'Bigtable Cluster',
  },
  BACKUPS: {
    _type: 'google_bigtable_backup',
    _class: ['Backup'],
    resourceName: 'Bigtable Backup',
  },
  TABLES: {
    _type: 'google_bigtable_table',
    _class: ['DataCollection'],
    resourceName: 'Bigtable Table',
  },
  LOCATIONS: {
    _type: 'google_bigtable_location',
    _class: ['Site'],
    resourceName: 'Bigtable Location',
  },
};
