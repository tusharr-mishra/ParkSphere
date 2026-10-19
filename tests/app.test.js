process.env.NODE_ENV = 'test';
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

afterAll(async () => {
  await mongoose.connection.close();
});

describe('ParkSphere Express MVC Suite', () => {
  test('GET /health returns healthy status and uptime', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body).toHaveProperty('uptime');
    expect(res.body).toHaveProperty('database');
  });

  test('GET / renders the landing home page with status 200', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('ParkSphere');
    expect(res.text).toContain('Reserve Your Parking Spot in');
  });

  test('GET /login renders the sign in page', async () => {
    const res = await request(app).get('/login');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Sign In');
  });

  test('GET /register renders the registration page', async () => {
    const res = await request(app).get('/register');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Create Account');
  });

  test('GET unknown page renders 404 error page', async () => {
    const res = await request(app).get('/this-path-does-not-exist');
    expect(res.statusCode).toBe(404);
    expect(res.text).toContain('404');
  });
});
