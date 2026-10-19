import { auditLogsService } from './auditLogs.service.js';

describe('auditLogs Module', () => {
  test('should return module status', async () => {
    const res = await auditLogsService.getStatus();
    expect(res.status).toBe('active');
    expect(res.domain).toBe('auditLogs');
  });
});
