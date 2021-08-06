import { bigtableadmin_v2, google } from 'googleapis';
import { Client } from '../../google-cloud/client';

export class BigTableClient extends Client {
  private client = google.bigtableadmin('v2');

  async iterateOperations(
    callback: (data: bigtableadmin_v2.Schema$Operation) => Promise<void>,
  ): Promise<void> {
    const auth = await this.getAuthenticatedServiceClient();

    await this.iterateApi(
      async (nextPageToken) => {
        return await this.client.operations.projects.operations.list({
          auth,
          pageSize: 500, // 500 is the max
          pageToken: nextPageToken,
          name: `operations/projects/${this.projectId}`,
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
    callback: (data: bigtableadmin_v2.Schema$Instance) => Promise<void>,
  ): Promise<void> {
    const auth = await this.getAuthenticatedServiceClient();

    await this.iterateApi(
      async (nextPageToken) => {
        return await this.client.projects.instances.list({
          auth,
          pageToken: nextPageToken,
          parent: `projects/${this.projectId}`,
        });
      },
      async (data: bigtableadmin_v2.Schema$ListInstancesResponse) => {
        for (const instanceResult of data.instances || []) {
          await callback(instanceResult);
        }
      },
    );
  }

  async iterateAppProfiles(
    instanceId: string,
    callback: (data: bigtableadmin_v2.Schema$AppProfile) => Promise<void>,
  ): Promise<void> {
    const auth = await this.getAuthenticatedServiceClient();

    await this.iterateApi(
      async (nextPageToken) => {
        return await this.client.projects.instances.appProfiles.list({
          auth,
          pageToken: nextPageToken,
          parent: instanceId,
        });
      },
      async (data: bigtableadmin_v2.Schema$ListAppProfilesResponse) => {
        for (const appProfileResult of data.appProfiles || []) {
          await callback(appProfileResult);
        }
      },
    );
  }

  async iterateClusters(
    instanceId: string,
    callback: (data: bigtableadmin_v2.Schema$Cluster) => Promise<void>,
  ): Promise<void> {
    const auth = await this.getAuthenticatedServiceClient();

    await this.iterateApi(
      async (nextPageToken) => {
        return await this.client.projects.instances.clusters.list({
          auth,
          pageToken: nextPageToken,
          parent: instanceId,
        });
      },
      async (data: bigtableadmin_v2.Schema$ListClustersResponse) => {
        for (const clusterResult of data.clusters || []) {
          await callback(clusterResult);
        }
      },
    );
  }

  async iterateBackups(
    instanceId: string,
    clusterId: string,
    callback: (data: bigtableadmin_v2.Schema$Backup) => Promise<void>,
  ): Promise<void> {
    const auth = await this.getAuthenticatedServiceClient();

    await this.iterateApi(
      async (nextPageToken) => {
        return await this.client.projects.instances.clusters.backups.list({
          auth,
          pageToken: nextPageToken,
          parent: clusterId,
        });
      },
      async (data: bigtableadmin_v2.Schema$ListBackupsResponse) => {
        for (const backupResult of data.backups || []) {
          await callback(backupResult);
        }
      },
    );
  }

  async iterateTables(
    instanceId: string,
    callback: (data: bigtableadmin_v2.Schema$Table) => Promise<void>,
  ): Promise<void> {
    const auth = await this.getAuthenticatedServiceClient();

    await this.iterateApi(
      async (nextPageToken) => {
        return await this.client.projects.instances.tables.list({
          auth,
          pageToken: nextPageToken,
          parent: instanceId,
        });
      },
      async (data: bigtableadmin_v2.Schema$ListTablesResponse) => {
        for (const tableResult of data.tables || []) {
          await callback(tableResult);
        }
      },
    );
  }

  async iterateLocations(
    callback: (data: bigtableadmin_v2.Schema$Location) => Promise<void>,
  ): Promise<void> {
    const auth = await this.getAuthenticatedServiceClient();

    await this.iterateApi(
      async (nextPageToken) => {
        return await this.client.projects.locations.list({
          auth,
          pageToken: nextPageToken,
          name: `projects/${this.projectId}`,
        });
      },
      async (data: bigtableadmin_v2.Schema$ListLocationsResponse) => {
        for (const locationResult of data.locations || []) {
          await callback(locationResult);
        }
      },
    );
  }
}