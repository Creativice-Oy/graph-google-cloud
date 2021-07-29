import { billingbudgets_v1 } from 'googleapis';
import { createGoogleCloudIntegrationEntity } from '../../utils/entity';
import {
  ENTITY_CLASS_BILLING_BUDGET,
  ENTITY_TYPE_BILLING_BUDGET,
} from './constants';

export function createBillingBudgetEntity(
  data: billingbudgets_v1.Schema$GoogleCloudBillingBudgetsV1Budget,
) {
  return createGoogleCloudIntegrationEntity(data, {
    entityData: {
      source: data,
      assign: {
        _class: ENTITY_CLASS_BILLING_BUDGET,
        _type: ENTITY_TYPE_BILLING_BUDGET,
        _key: data.name as string,
        name: data.name,
        displayName: data.displayName as string,
      },
    },
  });
}
