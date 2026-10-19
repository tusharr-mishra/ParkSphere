import { slotsService } from './slots.service.js';

describe('slots Module', () => {
  test('should return module status', async () => {
    const res = await slotsService.getStatus();
    expect(res.status).toBe('active');
    expect(res.domain).toBe('slots');
  });
});
