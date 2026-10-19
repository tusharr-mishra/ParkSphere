import { usersService } from './users.service.js';

describe('users Module', () => {
  test('should return module status', async () => {
    const res = await usersService.getStatus();
    expect(res.status).toBe('active');
    expect(res.domain).toBe('users');
  });
});
