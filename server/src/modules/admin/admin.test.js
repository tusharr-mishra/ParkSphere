import { adminService } from './admin.service.js';

describe('admin Module', () => {
  test('should return module status', async () => {
    const res = await adminService.getStatus();
    expect(res.status).toBe('active');
    expect(res.domain).toBe('admin');
  });
});
