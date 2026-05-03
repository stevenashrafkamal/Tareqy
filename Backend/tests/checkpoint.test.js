import { describe, it, expect, beforeAll, afterAll, beforeEach, jest } from '@jest/globals';
import mongoose from 'mongoose';

const { default: app } = await import('../app.js');
const { default: request } = await import('supertest');

const { default: Checkpoint } = await import('../Database/models/checkpoint.model.js');
const { default: Track } = await import('../Database/models/track.model.js');
const { default: Level } = await import('../Database/models/level.model.js');
const { default: Step } = await import('../Database/models/step.model.js');

const { makeUserToken } = await import('./helpers/tokens.js');

const TEST_DB = 'mongodb://localhost:27017/tareqy_test';
beforeAll(async () => { await mongoose.connect(TEST_DB); });
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});
beforeEach(async () => {
  await Checkpoint.deleteMany({});
  await Track.deleteMany({});
  await Level.deleteMany({});
  await Step.deleteMany({});
});

// ── Setup IDs ─────────────────────────────
const userId = new mongoose.Types.ObjectId();
const trackId = new mongoose.Types.ObjectId();
const levelId = new mongoose.Types.ObjectId();
const stepId = new mongoose.Types.ObjectId();

const validBody = {
  track_id: trackId.toString(),
  level_id: levelId.toString(),
  last_step_id: stepId.toString()
};

// ── Seed Data ─────────────────────────────
const seedData = async () => {
  await Track.create({ _id: trackId, title: "Track" });

  await Level.create({
    _id: levelId,
    trackId,
    levelNumber: 1
  });

  await Step.create({
    _id: stepId,
    levelId,
    title: "Step 1",
    stepNumber: 1
  });
};

// ─────────────────────────────────────────
describe('POST /api/checkpoint', () => {
  it('200 – create or update checkpoint', async () => {
    await seedData();
    const token = makeUserToken(userId.toString());

    const res = await request(app)
      .post('/api/checkpoint')
      .set('token', token)
      .send(validBody);

    expect(res.status).toBe(200);
    expect(res.body.checkpoint.trackId.toString()).toBe(validBody.track_id);
  });

  it('404 – invalid track', async () => {
    const token = makeUserToken(userId.toString());
    const res = await request(app).post('/api/checkpoint').set('token', token).send(validBody);
    expect(res.status).toBe(404);
  });
});

// ─────────────────────────────────────────
describe('GET /api/checkpoint', () => {
  it('200 – get user checkpoints', async () => {
    await seedData();

    await Checkpoint.create({
      userId,
      trackId,
      levelId,
      lastStepId: stepId
    });

    const token = makeUserToken(userId.toString());

    const res = await request(app)
      .get('/api/checkpoint')
      .set('token', token);

    expect(res.status).toBe(200);
    expect(res.body.checkpoints.length).toBe(1);
  });
});