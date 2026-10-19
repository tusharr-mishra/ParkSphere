import { notificationsService } from './notifications.service.js';

describe('notifications Module', () => {
  test('should return module status', async () => {
    const res = await notificationsService.getStatus();
    expect(res.status).toBe('active');
    expect(res.domain).toBe('notifications');
  });
});
