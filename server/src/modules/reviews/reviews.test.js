import { reviewsService } from './reviews.service.js';

describe('reviews Module', () => {
  test('should return module status', async () => {
    const res = await reviewsService.getStatus();
    expect(res.status).toBe('active');
    expect(res.domain).toBe('reviews');
  });
});
