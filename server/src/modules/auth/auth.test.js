import { authService } from './auth.service.js';

describe('auth Module', () => {
  test('should return module status', async () => {
    const res = await authService.getStatus();
    expect(res.status).toBe('active');
    expect(res.domain).toBe('auth');
  });
});
