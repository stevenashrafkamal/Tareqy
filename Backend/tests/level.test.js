import { describe, it, expect, beforeAll, afterAll, beforeEach, jest } from '@jest/globals';
import mongoose from 'mongoose';

const { default: app } = await import('../app.js');
const { default: request } = await import('supertest');

const { default: Level } = await import('../Database/models/level.model.js');
const { default: Track } = await import('../Database/models/track.model.js');

const TEST_DB = 'mongodb://localhost:27017/tareqy_test';
const { makeAdminToken } = await import('./helpers/tokens.js');
beforeAll(async () => { await mongoose.connect(TEST_DB); });
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});
beforeEach(async () => {
  await Level.deleteMany({});
  await Track.deleteMany({});
});

// ── IDs ─────────────────────────────
const trackId = new mongoose.Types.ObjectId();

const validBody = {
  track_id: trackId.toString(),
  level_number: 1,
  level_difficulty: "beginner"
};

// ───────────────────────────────────
describe('POST /api/level', () => {
  it('201 – create level', async () => {
    await Track.create({ _id: trackId, title: "Track" });
    const adminToken = makeAdminToken(new mongoose.Types.ObjectId().toString());

    const res = await request(app)
      .post('/api/level')
      .set('token', adminToken)
      .send(validBody);

    if (res.status === 500) console.log('500 ERROR:', res.body);
    expect(res.status).toBe(201);
    expect(res.body.level.levelNumber).toBe(1);
  });

  it('404 – track not found', async () => {
    const adminToken = makeAdminToken(new mongoose.Types.ObjectId().toString());
    const res = await request(app).post('/api/level').set('token', adminToken).send(validBody);
    expect(res.status).toBe(404);
  });
});

// ───────────────────────────────────
describe('GET /api/level/track/:trackId', () => {
  it('200 – get levels by track', async () => {
    await Track.create({ _id: trackId, title: "Track" });

    await Level.create({ trackId, levelNumber: 1 });

    const res = await request(app).get(`/api/level/track/${trackId}`);

    expect(res.status).toBe(200);
    expect(res.body.levels.length).toBe(1);
  });
});