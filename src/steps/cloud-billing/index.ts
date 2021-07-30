import { IntegrationStep } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../types';
import { BillingBudgetClient } from './client';
import {
  ENTITY_CLASS_BILLING_BUDGET,
  ENTITY_TYPE_BILLING_BUDGET,
  STEP_BILLING_BUDGET,
} from './constants';
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
    console.log('budget', budget);
    const budgetEntity = createBillingBudgetEntity(budget);
    await jobState.addEntity(budgetEntity);
  });
}

export const cloudBillingSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: STEP_BILLING_BUDGET,
    name: 'Billing Budget',
    entities: [
      {
        resourceName: 'Billing Budget',
        _type: ENTITY_TYPE_BILLING_BUDGET,
        _class: ENTITY_CLASS_BILLING_BUDGET,
      },
    ],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchBillingBudget,
  },
];
