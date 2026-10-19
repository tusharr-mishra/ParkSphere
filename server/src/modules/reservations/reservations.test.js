import { reservationsService } from './reservations.service.js';

describe('reservations Module', () => {
  test('should return module status', async () => {
    const res = await reservationsService.getStatus();
    expect(res.status).toBe('active');
    expect(res.domain).toBe('reservations');
  });
});
