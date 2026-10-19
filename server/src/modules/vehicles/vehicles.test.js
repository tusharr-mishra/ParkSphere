import { vehiclesService } from './vehicles.service.js';

describe('vehicles Module', () => {
  test('should return module status', async () => {
    const res = await vehiclesService.getStatus();
    expect(res.status).toBe('active');
    expect(res.domain).toBe('vehicles');
  });
});
