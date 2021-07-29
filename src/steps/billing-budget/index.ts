import { IntegrationStep } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../types';
import { BillingBudgetClient } from './client';
import { STEP_BILLING_BUDGET } from './constants';
import { createBillingBudgetEntity } from './converters';

export async function fetchBillingBudget(
  context: IntegrationStepContext,
): Promise<void> {
  const {
    jobState,
    instance: { config },
  } = context;
  const client = new BillingBudgetClient({ config });
  await client.iterateBudgets(async (budget) => {
    const budgetEntity = createBillingBudgetEntity(budget);
    await jobState.addEntity(budgetEntity);
  });
}

export const binaryAuthorizationSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: STEP_BILLING_BUDGET,
    name: 'Billing Budget',
    entities: [],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchBillingBudget,
  },
];
