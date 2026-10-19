import { parkingService } from './parking.service.js';

describe('parking Module', () => {
  test('should return module status', async () => {
    const res = await parkingService.getStatus();
    expect(res.status).toBe('active');
    expect(res.domain).toBe('parking');
  });
});
