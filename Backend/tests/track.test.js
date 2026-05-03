import { describe, it, expect, beforeAll, afterAll, beforeEach, jest } from '@jest/globals';
import mongoose from 'mongoose';

const { default: app } = await import('../app.js');
const { default: request } = await import('supertest');

const { default: Track } = await import('../Database/models/track.model.js');

const { makeAdminToken } = await import('./helpers/tokens.js');

const TEST_DB = 'mongodb://localhost:27017/tareqy_test';
beforeAll(async () => { await mongoose.connect(TEST_DB); });
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});
beforeEach(async () => {
  await Track.deleteMany({});
});

// ───────────────────────────────────
const validBody = {
  title: "Backend Track",
  description: "Node.js roadmap",
  type: "develop"
};

// ───────────────────────────────────
describe('POST /api/track', () => {
  it('201 – create track', async () => {
    const adminToken = makeAdminToken(new mongoose.Types.ObjectId().toString());
    const res = await request(app)
      .post('/api/track')
      .set('token', adminToken)
      .send(validBody);

    expect(res.status).toBe(201);
    expect(res.body.track.title).toBe(validBody.title);
  });
});

// ───────────────────────────────────
describe('GET /api/track', () => {
  it('200 – get all tracks', async () => {
    await Track.create(validBody);

    const res = await request(app).get('/api/track');

    expect(res.status).toBe(200);
    expect(res.body.tracks.length).toBe(1);
  });
});

// ───────────────────────────────────
describe('GET /api/track/search', () => {
  it('200 – search tracks', async () => {
    await Track.create(validBody);

    const res = await request(app)
      .get('/api/track/search?title=Backend');

    expect(res.status).toBe(200);
    expect(res.body.tracks.length).toBe(1);
  });
});