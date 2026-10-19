import { paymentsService } from './payments.service.js';

describe('payments Module', () => {
  test('should return module status', async () => {
    const res = await paymentsService.getStatus();
    expect(res.status).toBe('active');
    expect(res.domain).toBe('payments');
  });
});
