import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import mongoose from 'mongoose';

const { default: app }      = await import('../app.js');
const {   default: request }  = await import('supertest');
const { default: Challenge } = await import('../Database/models/challenge.model.js');

await import('../Database/models/track.model.js').catch(() => {});
await import('../Database/models/level.model.js').catch(() => {});
await import('../Database/models/step.model.js').catch(() => {});
await import('../Database/models/codeReviewer.model.js').catch(() => {});
await import('../Database/models/user.js').catch(() => {});

const TEST_DB = 'mongodb://localhost:27017/tareqy_test';

beforeAll(async () => { await mongoose.connect(TEST_DB); });
afterAll(async ()  => { 
  await mongoose.connection.dropDatabase(); 
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect(); 
  }
});
beforeEach(async () => { await Challenge.deleteMany({}); });

// ── Shared IDs & bodies ───────────────────────────────────────────────────────
const track    = new mongoose.Types.ObjectId();
const level    = new mongoose.Types.ObjectId();
const step     = new mongoose.Types.ObjectId();
const reviewer = new mongoose.Types.ObjectId();

const validBody = {
  track_id: track.toString(),
  level_id: level.toString(),
  step_id:  step.toString(),
  content:  'Write a function that reverses a string.',
};

// ──────────────
const createChallenge = () =>
  Challenge.create({ trackId: track, levelId: level, stepId: step, content: 'Test challenge' });

// ─────────────────────────────────────────────────────────────────────────────
describe('POST /api/challenge', () => {
  it('201 – creates challenge with valid snake_case body', async () => {
    const res = await request(app).post('/api/challenge').send(validBody);
    expect(res.status).toBe(201);
    expect(res.body.challenge).toHaveProperty('content', validBody.content);
    // Because controller mapped track_id -> trackId, this should now be saved correctly
    expect(res.body.challenge.trackId.toString()).toBe(validBody.track_id);
  });

  it('422 – missing content field', async () => {
    const { content: _, ...body } = validBody;
    const res = await request(app).post('/api/challenge').send(body);
    expect(res.status).toBe(422);
  });

  it('422 – missing track_id', async () => {
    const { track_id: _, ...body } = validBody;
    const res = await request(app).post('/api/challenge').send(body);
    expect(res.status).toBe(422);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('GET /api/challenge/:id', () => {
  it('200 – returns challenge by id', async () => {
    const ch  = await createChallenge();
    const res = await request(app).get(`/api/challenge/${ch._id}`);
    console.log("CHALLENGE BY ID RESPONSE:", res.body);
    expect(res.status).toBe(200);
    expect(res.body.challenge._id.toString()).toBe(ch._id.toString());
  });

  it('404 – non-existent challenge', async () => {
    const res = await request(app).get(`/api/challenge/${new mongoose.Types.ObjectId()}`);
    expect(res.status).toBe(404);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('GET /api/challenge/track/:trackId', () => {
  it('200 – returns challenges for the track', async () => {
    await createChallenge();
    const res = await request(app).get(`/api/challenge/track/${track}`);
    console.log("CHALLENGE BY TRACK RESPONSE:", res.body);
    expect(res.status).toBe(200);
    expect(res.body.challenges.length).toBe(1);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('PUT /api/challenge/:id', () => {
  it('200 – updates challenge content', async () => {
    const ch  = await createChallenge();
    const res = await request(app).put(`/api/challenge/${ch._id}`).send({ content: 'Updated content' });
    expect(res.status).toBe(200);
    expect(res.body.challenge.content).toBe('Updated content');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('PUT /api/challenge/:id/reviewer', () => {
  it('200 – assigns reviewer to challenge', async () => {
    const ch  = await createChallenge();
    const res = await request(app).put(`/api/challenge/${ch._id}/reviewer`)
      .send({ reviewer_id: reviewer.toString() });
    expect(res.status).toBe(200);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('DELETE /api/challenge/:id', () => {
  it('200 – deletes existing challenge', async () => {
    const ch  = await createChallenge();
    const res = await request(app).delete(`/api/challenge/${ch._id}`);
    expect(res.status).toBe(200);
    expect(await Challenge.findById(ch._id)).toBeNull();
  });
});
