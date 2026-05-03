
import { jest, describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { config as dotenvConfig } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

import jwt from 'jsonwebtoken';

const __fn = fileURLToPath(import.meta.url);
dotenvConfig({ path: resolve(dirname(__fn), '../.env') });

jest.unstable_mockModule('../utils/sendEmail.js', () => ({
  sendEmail: jest.fn().mockResolvedValue(undefined),
}));

const { default: app }           = await import('../app.js');
const { default: request }       = await import('supertest');
const { default: CodeReviewer }  = await import('../Database/models/codeReviewer.model.js');
const { default: VerifyingEmail }= await import('../Database/models/verifyingEmail.model.js');
const { User }                   = await import('../Database/models/user.js');

const makeReviewerToken = (id) => {
  return jwt.sign({ id, role: 'reviewer' }, process.env.ACCESS_TOKEN_SECRET || 'test_reviewer_secret', { expiresIn: '1d' });
};
const makeAdminToken = (id) => {
  return jwt.sign({ id, role: 'admin' }, process.env.SECRET_ACCESS_TOKEN || 'test_user_secret', { expiresIn: '1d' });
};

const TEST_DB = 'mongodb://localhost:27017/tareqy_test';
const PASS = 'password123';

beforeAll(async () => { await mongoose.connect(TEST_DB); });
afterAll(async ()  => { 
  await mongoose.connection.dropDatabase(); 
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect(); 
  }
});
beforeEach(async () => {
  await CodeReviewer.deleteMany({});
  await VerifyingEmail.deleteMany({});
  await User.deleteMany({});
});

// ── Helpers ───────────────────────────────────────────────────────────────────
const validSignup = { username: 'reviewer1', email: `rev${Date.now()}@t.com`, password: PASS };

const seedReviewer = async (extra = {}) =>
  CodeReviewer.create({
    username: 'reviewer1', email: `r${Date.now()}@t.com`,
    password: await bcrypt.hash(PASS, 8),
    activationStatus: true, accountStatus: 'active', ...extra,
  });

const seedAdmin = async () =>
  User.create({ username: 'admin', email: `a${Date.now()}@t.com`, password: await bcrypt.hash(PASS, 8), isConfirmed: true, role: 'admin' });

// ─────────────────────────────────────────────────────────────────────────────
describe('POST /api/reviewer/signup', () => {
  it('201 – registers reviewer and creates OTP record', async () => {
    const freshSignup = { ...validSignup, email: `n${Date.now()}@t.com` };
    const res = await request(app).post('/api/reviewer/signup').send(freshSignup);
    expect(res.status).toBe(201);
    expect(res.body.reviewer.email).toBe(freshSignup.email);
    const otp = await VerifyingEmail.findOne({ type: 'code reviewer' });
    expect(otp).not.toBeNull();
  });

  it('400 – duplicate email rejected', async () => {
    const dupSignup = { ...validSignup, email: `d${Date.now()}@t.com` };
    await request(app).post('/api/reviewer/signup').send(dupSignup);
    const res = await request(app).post('/api/reviewer/signup').send(dupSignup);
    expect(res.status).toBe(400);
  });

  it('422 – missing password', async () => {
    const res = await request(app).post('/api/reviewer/signup').send({ username: 'r', email: `e${Date.now()}@t.com` });
    expect(res.status).toBe(422);
  });

  it('422 – password too short', async () => {
    const res = await request(app).post('/api/reviewer/signup').send({ ...validSignup, email: `s${Date.now()}@t.com`, password: 'short' });
    expect(res.status).toBe(422);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('POST /api/reviewer/login', () => {
  it('200 – returns accessToken and refreshToken', async () => {
    const rev = await seedReviewer();
    const res = await request(app).post('/api/reviewer/login').send({ email: rev.email, password: PASS });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
  });

  it('404 – unknown email', async () => {
    const res = await request(app).post('/api/reviewer/login').send({ email: `u${Date.now()}@t.com`, password: PASS });
    expect(res.status).toBe(404);
  });

  it('400 – wrong password', async () => {
    const rev = await seedReviewer();
    const res = await request(app).post('/api/reviewer/login').send({ email: rev.email, password: 'wrongpassword' });
    expect(res.status).toBe(400);
  });

  it('403 – login blocked when not activated', async () => {
    const rev = await seedReviewer({ activationStatus: false });
    const res = await request(app).post('/api/reviewer/login').send({ email: rev.email, password: PASS });
    expect(res.status).toBe(403);
  });

  it('403 – login blocked when account suspended', async () => {
    const rev = await seedReviewer({ accountStatus: 'suspended' });
    const res = await request(app).post('/api/reviewer/login').send({ email: rev.email, password: PASS });
    expect(res.status).toBe(403);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('POST /api/reviewer/verify-email', () => {
  it('200 – valid OTP activates reviewer', async () => {
    const rev = await seedReviewer({ activationStatus: false });
    await VerifyingEmail.create({ OTP: '123456', type: 'code reviewer', targetId: rev._id });
    const res = await request(app).post('/api/reviewer/verify-email').send({ targetId: rev._id, OTP: '123456' });
    expect(res.status).toBe(200);
    expect(res.body.reviewer.activationStatus).toBe(true);
  });

  it('400 – invalid OTP rejected', async () => {
    const rev = await seedReviewer({ activationStatus: false });
    const res = await request(app).post('/api/reviewer/verify-email').send({ targetId: rev._id, OTP: '000000' });
    expect(res.status).toBe(400);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('GET /api/reviewer/profile  (reviewerAuth)', () => {
  it('200 – reviewer views own profile', async () => {
    const rev   = await seedReviewer();
    const token = makeReviewerToken(rev._id.toString());
    const res   = await request(app).get('/api/reviewer/profile').set('token', token);
    expect(res.status).toBe(200);
    expect(res.body.reviewer.email).toBe(rev.email);
  });

  it('401 – no token', async () => {
    const res = await request(app).get('/api/reviewer/profile');
    console.log("REVIEWER PROFILE NO TOKEN RESPONSE:", res.body);
    expect(res.status).toBe(401);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('PUT /api/reviewer/profile  (reviewerAuth)', () => {
  it('200 – reviewer updates username', async () => {
    const rev   = await seedReviewer();
    const token = makeReviewerToken(rev._id.toString());
    const res   = await request(app).put('/api/reviewer/profile').set('token', token).send({ username: 'updatedname' });
    expect(res.status).toBe(200);
    expect(res.body.data.username).toBe('updatedname');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('PUT /api/reviewer/change-password  (reviewerAuth)', () => {
  it('200 – reviewer changes password successfully', async () => {
    const rev   = await seedReviewer();
    const token = makeReviewerToken(rev._id.toString());
    const res   = await request(app)
      .put('/api/reviewer/change-password').set('token', token)
      .send({ old_password: PASS, new_password: 'newsecure123', confirm_password: 'newsecure123' });
    expect(res.status).toBe(200);
  });

  it('400 – wrong old password rejected', async () => {
    const rev   = await seedReviewer();
    const token = makeReviewerToken(rev._id.toString());
    const res   = await request(app)
      .put('/api/reviewer/change-password').set('token', token)
      .send({ old_password: 'wrongoldpass', new_password: 'newsecure123', confirm_password: 'newsecure123' });
    expect(res.status).toBe(400);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('GET /api/reviewer/search  (public)', () => {
  it('200 – finds reviewer by username', async () => {
    await seedReviewer();
    const res = await request(app).get('/api/reviewer/search').query({ username: 'reviewer' });
    expect(res.status).toBe(200);
    expect(res.body.reviewers.length).toBeGreaterThan(0);
  });

  it('200 – no results for unmatched query', async () => {
    const res = await request(app).get('/api/reviewer/search').query({ username: 'zzznobody' });
    expect(res.status).toBe(200);
    expect(res.body.reviewers.length).toBe(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('PUT /api/reviewer/activate/:id  (admin checkToken)', () => {
  it('200 – admin activates a reviewer', async () => {
    const rev   = await seedReviewer({ accountStatus: 'suspended' });
    const admin = await seedAdmin();
    const token = makeAdminToken(admin._id.toString());
    const res   = await request(app).put(`/api/reviewer/activate/${rev._id}`).set('token', token);
    expect(res.status).toBe(200);
    expect(res.body.data.accountStatus).toBe('active');
  });

  it('401 – unauthenticated request rejected', async () => {
    const rev = await seedReviewer();
    const res = await request(app).put(`/api/reviewer/activate/${rev._id}`);
    expect(res.status).toBe(401);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('POST /api/reviewer/logout  (reviewerAuth)', () => {
  it('200 – clears refreshToken on logout', async () => {
    const rev   = await seedReviewer({ refreshToken: 'some-old-token' });
    const token = makeReviewerToken(rev._id.toString());
    const res   = await request(app).post('/api/reviewer/logout').set('token', token);
    expect(res.status).toBe(200);
    const updated = await CodeReviewer.findById(rev._id);
    expect(updated.refreshToken).toBeNull();
  });
});
