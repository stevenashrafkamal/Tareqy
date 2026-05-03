import { jest, describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// ─────────────────────────────────────────────────────────────────────────────
jest.unstable_mockModule('../utils/Email/sendEmail.js', () => ({
  sendEmail: jest.fn().mockResolvedValue(undefined),
}));

const { default: app }    = await import('../app.js');
const { User }            = await import('../Database/models/user.js');
const { default: request} = await import('supertest');
const { makeUserToken, makeAdminToken } = await import('./helpers/tokens.js');

const TEST_DB = 'mongodb://localhost:27017/tareqy_test';

beforeAll(async () => { await mongoose.connect(TEST_DB); });
afterAll(async ()  => { 
  await mongoose.connection.dropDatabase(); 
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect(); 
  }
});
beforeEach(async () => { await User.deleteMany({}); });

// ─────────────────────────────────────────────────────────────────────────────
const PASS = 'password123';
const validSignup = { username: 'testuser', email: 'test@example.com', password: PASS };

const seedUser = async (extra = {}) => {
  const hashed = await bcrypt.hash(PASS, 8);
  return User.create({ username: 'testuser', email: 'test@example.com', password: hashed, isConfirmed: true, ...extra });
};

const seedAdmin = async () => {
  const hashed = await bcrypt.hash(PASS, 8);
  return User.create({ username: 'admin', email: 'admin@example.com', password: hashed, isConfirmed: true, role: 'admin' });
};

// ─────────────────────────────────────────────────────────────────────────────
describe('POST /auth/signup', () => {
  it('201 – creates user and triggers email confirmation', async () => {
    const res = await request(app).post('/auth/signup').send(validSignup);
    expect(res.status).toBe(201);
    expect(res.body.User).toHaveProperty('email', 'test@example.com');
    expect(res.body.User).not.toHaveProperty('password');
  });

  it('422 – missing username', async () => {
    const res = await request(app).post('/auth/signup').send({ email: 'test@example.com', password: PASS });
    expect(res.status).toBe(422);
  });

  it('422 – password too short', async () => {
    const res = await request(app).post('/auth/signup').send({ ...validSignup, password: 'short' });
    expect(res.status).toBe(422);
  });

  it('422 – invalid email format', async () => {
    const res = await request(app).post('/auth/signup').send({ ...validSignup, email: 'not-an-email' });
    expect(res.status).toBe(422);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('POST /auth/signin', () => {
  beforeEach(seedUser);

  it('200 – returns token on valid credentials', async () => {
    const res = await request(app).post('/auth/signin').send({ email: 'test@example.com', password: PASS });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('404 – unknown email', async () => {
    const res = await request(app).post('/auth/signin').send({ email: 'nobody@example.com', password: PASS });
    expect(res.status).toBe(404);
  });

  it('401 – wrong password', async () => {
    const res = await request(app).post('/auth/signin').send({ email: 'test@example.com', password: 'wrongpassword' });
    expect(res.status).toBe(401);
  });

  it('403 – access blocked for unconfirmed email', async () => {
    await User.deleteMany({});
    await seedUser({ isConfirmed: false });
    const res = await request(app).post('/auth/signin').send({ email: 'test@example.com', password: PASS });
    expect(res.status).toBe(403);
  });

  it('422 – missing password field', async () => {
    const res = await request(app).post('/auth/signin').send({ email: 'test@example.com' });
    expect(res.status).toBe(422);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('GET /auth/me', () => {
  it('200 – returns user data with valid token', async () => {
    const user  = await seedUser();
    const token = makeUserToken(user._id.toString());
    const res   = await request(app).get('/auth/me').set('token', token);
    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe('test@example.com');
  });

  it('401 – no token', async () => {
    const res = await request(app).get('/auth/me');
    expect(res.status).toBe(401);
  });

  it('401 – malformed token triggers error handler', async () => {
    const res = await request(app).get('/auth/me').set('token', 'bad.token');
    expect(res.status).toBe(401);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('GET /auth/all  (admin only)', () => {
  it('200 – admin can list users', async () => {
    const admin = await seedAdmin();
    const token = makeAdminToken(admin._id.toString());
    const res   = await request(app).get('/auth/all').set('token', token);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('403 – regular user forbidden', async () => {
    const user  = await seedUser();
    const token = makeUserToken(user._id.toString());
    const res   = await request(app).get('/auth/all').set('token', token);
    expect(res.status).toBe(403);
  });

  it('401 – unauthenticated', async () => {
    const res = await request(app).get('/auth/all');
    expect(res.status).toBe(401);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('DELETE /auth/:id  (admin only)', () => {
  it('200 – admin deletes a user', async () => {
    const admin  = await seedAdmin();
    const target = await seedUser({ email: 'victim@example.com', username: 'victim' });
    const token  = makeAdminToken(admin._id.toString());
    const res    = await request(app).delete(`/auth/${target._id}`).set('token', token);
    expect(res.status).toBe(200);
  });

  it('404 – non-existent user', async () => {
    const admin = await seedAdmin();
    const token = makeAdminToken(admin._id.toString());
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).delete(`/auth/${fakeId}`).set('token', token);
    expect(res.status).toBe(404);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('PUT /auth/update', () => {
  it('200 – user updates username', async () => {
    const user  = await seedUser();
    const token = makeUserToken(user._id.toString());
    const res   = await request(app).put('/auth/update').set('token', token).send({ username: 'newname' });
    expect(res.status).toBe(200);
    expect(res.body.user.username).toBe('newname');
  });

  it('401 – unauthenticated update rejected', async () => {
    const res = await request(app).put('/auth/update').send({ username: 'hacker' });
    expect(res.status).toBe(401);
  });
});
