import { google, billingbudgets_v1 } from 'googleapis';
import { Client } from '../../google-cloud/client';

export class BillingBudgetClient extends Client {
  private client = google.billingbudgets('v1');

  async iterateBudgets(
    callback: (
      data: billingbudgets_v1.Schema$GoogleCloudBillingBudgetsV1Budget,
    ) => Promise<void>,
  ): Promise<void> {
    const auth = await this.getAuthenticatedServiceClient();

    const result = await this.client.billingAccounts.budgets.list({
      auth,
      parent: `billingAccounts/${this.billingAccountId}`,
    });
    for (const budget of result.data.budgets || []) {
      await callback(budget);
    }
  }
}
