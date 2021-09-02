export const STEP_RESOURCE_MANAGER_ORGANIZATION =
  'fetch-resource-manager-organization';
export const STEP_RESOURCE_MANAGER_FOLDERS = 'fetch-resource-manager-folders';
export const STEP_RESOURCE_MANAGER_PROJECT = 'fetch-resource-manager-project';
export const STEP_RESOURCE_MANAGER_ORG_PROJECT_RELATIONSHIPS =
  'fetch-resource-manager-org-project-relationships';
export const STEP_RESOURCE_MANAGER_IAM_POLICY =
  'fetch-resource-manager-iam-policy';
export const STEP_AUDIT_CONFIG_IAM_POLICY = 'fetch-iam-policy-audit-config';

export const ORGANIZATION_ENTITY_TYPE = 'google_cloud_organization';
export const ORGANIZATION_ENTITY_CLASS = 'Organization';

export const FOLDER_ENTITY_TYPE = 'google_cloud_folder';
export const FOLDER_ENTITY_CLASS = 'Group';

export const PROJECT_ENTITY_TYPE = 'google_cloud_project';
export const PROJECT_ENTITY_CLASS = 'Account';

export const AUDIT_CONFIG_ENTITY_TYPE = 'google_cloud_audit_config';
export const AUDIT_CONFIG_ENTITY_CLASS = 'Configuration';

export const IAM_SERVICE_ACCOUNT_ASSIGNED_ROLE_RELATIONSHIP_TYPE =
  'google_iam_service_account_assigned_role';
export const ORGANIZATION_HAS_FOLDER_RELATIONSHIP_TYPE =
  'google_cloud_organization_has_folder';
export const FOLDER_HAS_FOLDER_RELATIONSHIP_TYPE =
  'google_cloud_folder_has_folder';
export const ORGANIZATION_HAS_PROJECT_RELATIONSHIP_TYPE =
  'google_organization_has_project';
export const FOLDER_HAS_PROJECT_RELATIONSHIP_TYPE = 'google_folder_has_project';
export const AUDIT_CONFIG_MONITORS_SERVICE_RELATIONSHIP_TYPE =
  'google_cloud_audit_config_monitors_api_service';

export const AUDIT_CONFIG_LIMITS_SERVICE_ACCOUNT_RELATIONSHIP_TYPE =
  'google_cloud_audit_config_limits_service_account';
export const AUDIT_CONFIG_LIMITS_USER_RELATIONSHIP_TYPE =
  'google_cloud_audit_config_limits_user';
export const AUDIT_CONFIG_LIMITS_GROUP_RELATIONSHIP_TYPE =
  'google_cloud_audit_config_limits_group';
export const AUDIT_CONFIG_LIMITS_DOMAIN_RELATIONSHIP_TYPE =
  'google_cloud_audit_config_limits_domain';
