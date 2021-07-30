import { bigtableadmin_v2, google } from 'googleapis';
import { Client } from '../../google-cloud/client';
import { IntegrationStepContext } from '../../types';

export class BigTableClient extends Client {
  private client = google.bigtableadmin('v2');

  async iterateOperations(
    context: IntegrationStepContext,
    callback: (data: bigtableadmin_v2.Schema$Operation) => Promise<void>,
  ): Promise<void> {
    const auth = await this.getAuthenticatedServiceClient();

    await this.iterateApi(
      async (nextPageToken) => {
        return await this.client.operations.projects.operations.list({
          auth,
          pageSize: 500, // 500 is the max
          pageToken: nextPageToken,
          name: `operations/projects/${context.instance.config.projectId}`,
        });
      },
      async (data: bigtableadmin_v2.Schema$ListOperationsResponse) => {
        for (const operationResult of data.operations || []) {
          await callback(operationResult);
        }
      },
    );
  }

  async iterateInstances(
    context: IntegrationStepContext,
    callback: (data: bigtableadmin_v2.Schema$Instance) => Promise<void>,
  ): Promise<void> {
    const auth = await this.getAuthenticatedServiceClient();

    await this.iterateApi(
      async (nextPageToken) => {
        return await this.client.projects.instances.list({
          auth,
          pageToken: nextPageToken,
          parent: `projects/${context.instance.config.projectId}`,
        });
      },
      async (data: bigtableadmin_v2.Schema$ListInstancesResponse) => {
        for (const instanceResult of data.instances || []) {
          await callback(instanceResult);
        }
      },
    );
  }
}
