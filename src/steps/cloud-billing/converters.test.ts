import { getMockBillingBudget } from '../../../test/mocks';
import { createBillingBudgetEntity } from './converters';

describe('#createBinaryAuthorizationPolicy', () => {
  test('should convert to entity', () => {
    expect(createBillingBudgetEntity(getMockBillingBudget())).toMatchSnapshot();
  });
});
