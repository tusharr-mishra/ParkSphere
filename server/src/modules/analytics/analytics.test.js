import { analyticsService } from './analytics.service.js';

describe('analytics Module', () => {
  test('should return module status', async () => {
    const res = await analyticsService.getStatus();
    expect(res.status).toBe('active');
    expect(res.domain).toBe('analytics');
  });
});
