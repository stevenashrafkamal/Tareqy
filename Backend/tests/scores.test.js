
import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const { default: app }        = await import('../app.js');
const { default: request }    = await import('supertest');
const { Score }               = await import('../Database/models/score.model.js');
const { default: Submission } = await import('../Database/models/submission.model.js');
const { default: Challenge }  = await import('../Database/models/challenge.model.js');
const { User }                = await import('../Database/models/user.js');
const { makeUserToken, makeAdminToken } = await import('./helpers/tokens.js');

const TEST_DB = 'mongodb://localhost:27017/tareqy_test';
const PASS = 'password123';

beforeAll(async () => { await mongoose.connect(TEST_DB); });
afterAll(async ()  => { await mongoose.connection.dropDatabase(); await mongoose.connection.close(); });
beforeEach(async () => {
  await Score.deleteMany({});
  await Submission.deleteMany({});
  await Challenge.deleteMany({});
  await User.deleteMany({});
});

// ── Seed helpers (all async — they use await) ─────────────────────────────────
const seedAdmin = async () =>
  User.create({ username: 'admin', email: `a${Date.now()}@t.com`, password: await bcrypt.hash(PASS, 8), isConfirmed: true, role: 'admin' });

const seedUser = async () =>
  User.create({ username: 'user1', email: `u${Date.now()}@t.com`, password: await bcrypt.hash(PASS, 8), isConfirmed: true });

const seedChallenge = () => Challenge.create({
  trackId: new mongoose.Types.ObjectId(), levelId: new mongoose.Types.ObjectId(),
  stepId: new mongoose.Types.ObjectId(), content: 'challenge content',
});

const seedSubmission = (userId, challengeId) =>
  Submission.create({ userId, type: 'challenge', fileType: 'file', submissionUrl: 'http://x.com/f.zip', challengeId });

const seedFullScore = async () => {
  const user  = await seedUser();
  const ch    = await seedChallenge();
  const sub   = await seedSubmission(user._id, ch._id);
  const score = await Score.create({ user: user._id, challenge: ch._id, submission: sub._id, score: 85 });
  return { user, ch, sub, score };
};

// ─────────────────────────────────────────────────────────────────────────────
describe('POST /scores  (admin only)', () => {
  it('201 – admin adds a score', async () => {
    const admin = await seedAdmin();
    const user  = await seedUser();
    const ch    = await seedChallenge();
    const sub   = await seedSubmission(user._id, ch._id);
    const token = makeAdminToken(admin._id.toString());
    const res = await request(app).post('/scores').set('token', token).send({
      user_id:       user._id.toString(),
      challenge_id:  ch._id.toString(),
      submission_id: sub._id.toString(),
      score:         92,
    });
    expect(res.status).toBe(201);
    expect(res.body.data.score).toBe(92);
  });

  it('409 – duplicate submission score rejected', async () => {
    const admin = await seedAdmin();
    const { user, ch, sub } = await seedFullScore();
    const token = makeAdminToken(admin._id.toString());
    const res = await request(app).post('/scores').set('token', token).send({
      user_id: user._id.toString(), challenge_id: ch._id.toString(),
      submission_id: sub._id.toString(), score: 50,
    });
    expect(res.status).toBe(409);
  });

  it('403 – regular user cannot add score', async () => {
    const user  = await seedUser();
    const token = makeUserToken(user._id.toString());
    const res   = await request(app).post('/scores').set('token', token)
      .send({ user_id: user._id.toString(), challenge_id: 'x', submission_id: 'x', score: 80 });
    expect(res.status).toBe(403);
  });

  it('401 – unauthenticated request rejected', async () => {
    const res = await request(app).post('/scores').send({ score: 80 });
    expect(res.status).toBe(401);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('PUT /scores/:id  (admin only)', () => {
  it('200 – admin updates a score', async () => {
    const admin     = await seedAdmin();
    const { score } = await seedFullScore();
    const token     = makeAdminToken(admin._id.toString());
    const res = await request(app).put(`/scores/${score._id}`).set('token', token).send({ score: 99 });
    expect(res.status).toBe(200);
    expect(res.body.data.score).toBe(99);
  });

  it('404 – updating non-existent score', async () => {
    const admin = await seedAdmin();
    const token = makeAdminToken(admin._id.toString());
    const res   = await request(app).put(`/scores/${new mongoose.Types.ObjectId()}`).set('token', token).send({ score: 50 });
    expect(res.status).toBe(404);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('GET /scores/submission/:submissionId', () => {
  it('200 – retrieves score by submissionId', async () => {
    const reqUser   = await seedUser();
    const { score } = await seedFullScore();
    const token     = makeUserToken(reqUser._id.toString());
    const res = await request(app).get(`/scores/submission/${score.submission}`).set('token', token);
    expect(res.status).toBe(200);
    expect(res.body.data.score).toBe(85);
  });

  it('404 – no score for unknown submissionId', async () => {
    const user  = await seedUser();
    const token = makeUserToken(user._id.toString());
    const res   = await request(app).get(`/scores/submission/${new mongoose.Types.ObjectId()}`).set('token', token);
    expect(res.status).toBe(404);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('GET /scores/user/:userId', () => {
  it('200 – retrieves all scores for a user', async () => {
    const reqUser   = await seedUser();
    const { user }  = await seedFullScore();
    const token     = makeUserToken(reqUser._id.toString());
    const res = await request(app).get(`/scores/user/${user._id}`).set('token', token);
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(1);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('GET /scores/challenge/:challengeId', () => {
  it('200 – retrieves leaderboard for a challenge', async () => {
    const reqUser = await seedUser();
    const { ch }  = await seedFullScore();
    const token   = makeUserToken(reqUser._id.toString());
    const res = await request(app).get(`/scores/challenge/${ch._id}`).set('token', token);
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(1);
  });
});
