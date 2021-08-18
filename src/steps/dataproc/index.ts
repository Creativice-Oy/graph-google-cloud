import {
  createDirectRelationship,
  IntegrationStep,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../types';
import { getKmsGraphObjectKeyFromKmsKeyName } from '../../utils/kms';
import { ENTITY_TYPE_COMPUTE_IMAGE, STEP_COMPUTE_IMAGES } from '../compute';
import { ENTITY_TYPE_KMS_KEY, STEP_CLOUD_KMS_KEYS } from '../kms';
import { DataProcClient } from './client';
import {
  ENTITY_CLASS_DATAPROC_CLUSTER,
  ENTITY_TYPE_DATAPROC_CLUSTER,
  RELATIONSHIP_TYPE_DATAPROC_CLUSTER_USES_COMPUTE_IMAGE,
  RELATIONSHIP_TYPE_DATAPROC_CLUSTER_USES_KMS_CRYPTO_KEY,
  STEP_CREATE_CLUSTER_IMAGE_RELATIONSHIPS,
  STEP_DATAPROC_CLUSTERS,
} from './constants';
import { createDataprocClusterEntity } from './converters';

export async function fetchDataprocClusters(
  context: IntegrationStepContext,
): Promise<void> {
  const {
    jobState,
    instance: { config },
  } = context;

  const client = new DataProcClient({ config });
  await client.iterateClusters(async (cluster) => {
    const clusterEntity = createDataprocClusterEntity(cluster);
    await jobState.addEntity(clusterEntity);

    const kmsKey = cluster.config?.encryptionConfig?.gcePdKmsKeyName;
    if (kmsKey) {
      const kmsKeyEntity = await jobState.findEntity(
        getKmsGraphObjectKeyFromKmsKeyName(kmsKey),
      );

      if (kmsKeyEntity) {
        await jobState.addRelationship(
          createDirectRelationship({
            _class: RelationshipClass.USES,
            from: clusterEntity,
            to: kmsKeyEntity,
          }),
        );
      }
    }
  });
}

export async function createClusterImageRelationships(
  context: IntegrationStepContext,
): Promise<void> {
  const { jobState } = context;

  await jobState.iterateEntities(
    { _type: ENTITY_TYPE_DATAPROC_CLUSTER },
    async (clusterEntity) => {
      const imageEntity = await jobState.findEntity(
        clusterEntity.masterConfigImageUri as string,
      );

      if (imageEntity) {
        await jobState.addRelationship(
          createDirectRelationship({
            _class: RelationshipClass.USES,
            from: clusterEntity,
            to: imageEntity,
          }),
        );
      }
    },
  );
}

export const dataprocSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: STEP_DATAPROC_CLUSTERS,
    name: 'Dataproc Clusters',
    entities: [
      {
        resourceName: 'Dataproc Cluster',
        _type: ENTITY_TYPE_DATAPROC_CLUSTER,
        _class: ENTITY_CLASS_DATAPROC_CLUSTER,
      },
    ],
    relationships: [
      {
        _class: RelationshipClass.USES,
        _type: RELATIONSHIP_TYPE_DATAPROC_CLUSTER_USES_KMS_CRYPTO_KEY,
        sourceType: ENTITY_TYPE_DATAPROC_CLUSTER,
        targetType: ENTITY_TYPE_KMS_KEY,
      },
    ],
    dependsOn: [STEP_CLOUD_KMS_KEYS],
    executionHandler: fetchDataprocClusters,
  },
  {
    id: STEP_CREATE_CLUSTER_IMAGE_RELATIONSHIPS,
    name: 'Dataproc Cluster to Storage Bucket Relationships',
    entities: [],
    relationships: [
      {
        _class: RelationshipClass.USES,
        _type: RELATIONSHIP_TYPE_DATAPROC_CLUSTER_USES_COMPUTE_IMAGE,
        sourceType: ENTITY_TYPE_DATAPROC_CLUSTER,
        targetType: ENTITY_TYPE_COMPUTE_IMAGE,
      },
    ],
    dependsOn: [STEP_DATAPROC_CLUSTERS, STEP_COMPUTE_IMAGES],
    executionHandler: createClusterImageRelationships,
  },
];
