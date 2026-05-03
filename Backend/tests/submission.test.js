
import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const { default: app }        = await import('../app.js');
const { default: request }    = await import('supertest');
const { default: Submission } = await import('../Database/models/submission.model.js');
const { default: Challenge }  = await import('../Database/models/challenge.model.js');
const { User }                = await import('../Database/models/user.js');

const TEST_DB = 'mongodb://localhost:27017/tareqy_test';
const PASS = 'password123';

beforeAll(async () => { await mongoose.connect(TEST_DB); });
afterAll(async ()  => { await mongoose.connection.dropDatabase(); await mongoose.connection.close(); });
beforeEach(async () => {
  await Submission.deleteMany({});
  await Challenge.deleteMany({});
  await User.deleteMany({});
});

// ── Seed helpers ──────────────────────────────────────────────────────────────
const seedChallenge = () => Challenge.create({
  trackId: new mongoose.Types.ObjectId(),
  levelId: new mongoose.Types.ObjectId(),
  stepId:  new mongoose.Types.ObjectId(),
  content: 'test challenge',
});

const seedUser = async () =>
  User.create({ username: 'usr', email: `u${Date.now()}@t.com`, password: await bcrypt.hash(PASS, 8), isConfirmed: true });

const seedSubmission = (userId, challengeId) =>
  Submission.create({ userId, type: 'challenge', fileType: 'file', submissionUrl: 'http://example.com/code.zip', challengeId });

const validBody = {
  type:            'challenge',
  file_type:       'file',
  submission_url:  'http://example.com/code.zip',
};

// ─────────────────────────────────────────────────────────────────────────────
describe('POST /api/submission/submit  (validation only)', () => {
  it('422 – missing type field', async () => {
    const { type: _, ...body } = validBody;
    const res = await request(app).post('/api/submission/submit').send(body);
    expect(res.status).toBe(422);
  });

  it('422 – missing file_type', async () => {
    const { file_type: _, ...body } = validBody;
    const res = await request(app).post('/api/submission/submit').send(body);
    expect(res.status).toBe(422);
  });

  it('422 – missing submission_url', async () => {
    const { submission_url: _, ...body } = validBody;
    const res = await request(app).post('/api/submission/submit').send(body);
    expect(res.status).toBe(422);
  });

  it('422 – invalid URL format for submission_url', async () => {
    const res = await request(app).post('/api/submission/submit').send({ ...validBody, submission_url: 'not-a-url' });
    expect(res.status).toBe(422);
  });

  it('500 – valid body crashes without auth (missing checkToken middleware on route)', async () => {
    const res = await request(app).post('/api/submission/submit').send(validBody);
    expect(res.status).toBe(500);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('GET /api/submission/:id', () => {
  it('200 – retrieves submission by id', async () => {
    const user = await seedUser();
    const ch   = await seedChallenge();
    const sub  = await seedSubmission(user._id, ch._id);
    const res  = await request(app).get(`/api/submission/${sub._id}`);
    expect(res.status).toBe(200);
    expect(res.body.data._id.toString()).toBe(sub._id.toString());
  });

  it('404 – non-existent submission', async () => {
    const res = await request(app).get(`/api/submission/${new mongoose.Types.ObjectId()}`);
    expect(res.status).toBe(404);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('GET /api/submission/challenge/:challengeId', () => {
  it('200 – returns submissions for a challenge', async () => {
    const user = await seedUser();
    const ch   = await seedChallenge();
    await seedSubmission(user._id, ch._id);
    const res = await request(app).get(`/api/submission/challenge/${ch._id}`);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
  });

  it('200 – empty array for unknown challenge', async () => {
    const res = await request(app).get(`/api/submission/challenge/${new mongoose.Types.ObjectId()}`);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('DELETE /api/submission/:id', () => {
  it('200 – deletes submission', async () => {
    const user = await seedUser();
    const ch   = await seedChallenge();
    const sub  = await seedSubmission(user._id, ch._id);
    const res  = await request(app).delete(`/api/submission/${sub._id}`);
    expect(res.status).toBe(200);
    expect(await Submission.findById(sub._id)).toBeNull();
  });

  it('404 – delete non-existent submission', async () => {
    const res = await request(app).delete(`/api/submission/${new mongoose.Types.ObjectId()}`);
    expect(res.status).toBe(404);
  });
});
