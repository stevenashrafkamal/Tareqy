
import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const { default: app }    = await import('../app.js');
const { default: request }= await import('supertest');
const { User }            = await import('../Database/models/user.js');
const { default: Review } = await import('../Modules/feedback/review/review.model.js');
const { default: Report } = await import('../Modules/feedback/report/report.model.js');
const { makeUserToken, makeAdminToken } = await import('./helpers/tokens.js');

const TEST_DB = 'mongodb://localhost:27017/tareqy_test';
const PASS = 'password123';

beforeAll(async () => { await mongoose.connect(TEST_DB); });
afterAll(async ()  => { await mongoose.connection.dropDatabase(); await mongoose.connection.close(); });
beforeEach(async () => {
  await Review.deleteMany({});
  await Report.deleteMany({});
  await User.deleteMany({});
});

// ── Seed helpers ──────────────────────────────────────────────────────────────
const seedUser = async (extra = {}) =>
  User.create({ username: 'tester', email: `u${Date.now()}@t.com`, password: await bcrypt.hash(PASS, 8), isConfirmed: true, ...extra });

const seedAdmin = async () =>
  User.create({ username: 'admin', email: `a${Date.now()}@t.com`, password: await bcrypt.hash(PASS, 8), isConfirmed: true, role: 'admin' });

const refId = new mongoose.Types.ObjectId().toString();

const validReviewBody = {
  total_stars:  4,
  title:        'Great module',
  description:  'Very well structured content.',
  target_type:  'step',  // strictly 'step', 'level', or 'roadmap'
  target_id:    refId,
};

const validReportBody = {
  type:         'feedback',
  title:        'Broken link',
  description:  'The step link returns 404.',
  target_type:  'step',
  target_id:    refId,
};

// ══════════════════════════════════════════════════════════════════════════════
//  REVIEWS  (/feedback/reviews)
// ══════════════════════════════════════════════════════════════════════════════
describe('POST /feedback/reviews  (authenticated)', () => {
  it('201 – authenticated user creates a review', async () => {
    const user  = await seedUser();
    const token = makeUserToken(user._id.toString());
    const res   = await request(app).post('/feedback/reviews').set('token', token).send(validReviewBody);
    expect(res.status).toBe(201);
    expect(res.body.data.rating).toBe(4);
  });

  it('401 – unauthenticated is rejected', async () => {
    const res = await request(app).post('/feedback/reviews').send(validReviewBody);
    expect(res.status).toBe(401);
  });

  it('422 – missing total_stars', async () => {
    const user  = await seedUser();
    const token = makeUserToken(user._id.toString());
    const { total_stars: _, ...body } = validReviewBody;
    const res = await request(app).post('/feedback/reviews').set('token', token).send(body);
    expect(res.status).toBe(422);
  });

  it('422 – invalid target_type enum value', async () => {
    const user  = await seedUser();
    const token = makeUserToken(user._id.toString());
    const res = await request(app).post('/feedback/reviews').set('token', token)
      .send({ ...validReviewBody, target_type: 'invalidtype' });
    expect(res.status).toBe(422);
  });

  it('422 – title too short (< 3 chars)', async () => {
    const user  = await seedUser();
    const token = makeUserToken(user._id.toString());
    const res = await request(app).post('/feedback/reviews').set('token', token)
      .send({ ...validReviewBody, title: 'ab' });
    expect(res.status).toBe(422);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('GET /feedback/reviews  (public)', () => {
  it('200 – returns empty list when no reviews', async () => {
    const res = await request(app).get('/feedback/reviews');
    expect(res.status).toBe(200);
    expect(res.body.results).toBe(0);
  });

  it('200 – returns seeded reviews', async () => {
    const user = await seedUser();
    await Review.create({ user: user._id, rating: 5, comment: 'wow', relatedTo: 'roadmap', referenceId: new mongoose.Types.ObjectId() });
    const res = await request(app).get('/feedback/reviews');
    expect(res.status).toBe(200);
    expect(res.body.results).toBe(1);
  });

  it('200 – filters by relatedTo query param', async () => {
    const user  = await seedUser();
    const refOId = new mongoose.Types.ObjectId();
    await Review.create({ user: user._id, rating: 4, comment: 'ok', relatedTo: 'level', referenceId: refOId });
    await Review.create({ user: user._id, rating: 3, comment: 'meh', relatedTo: 'step',  referenceId: refOId });
    const res = await request(app).get('/feedback/reviews').query({ relatedTo: 'level' });
    expect(res.status).toBe(200);
    expect(res.body.results).toBe(1);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('PUT /feedback/reviews/:id  (owner only)', () => {
  it('200 – owner updates their review', async () => {
    const user   = await seedUser();
    const token  = makeUserToken(user._id.toString());
    const review = await Review.create({ user: user._id, rating: 3, comment: 'old', relatedTo: 'roadmap', referenceId: new mongoose.Types.ObjectId() });
    const res = await request(app).put(`/feedback/reviews/${review._id}`)
      .set('token', token).send({ total_stars: 5, description: 'updated review text' });
    expect(res.status).toBe(200);
    expect(res.body.data.rating).toBe(5);
  });

  it('404 – another user cannot update a review they do not own', async () => {
    const owner  = await seedUser();
    const other  = await seedUser({ username: 'other' });
    const token  = makeUserToken(other._id.toString());
    const review = await Review.create({ user: owner._id, rating: 3, comment: 'mine', relatedTo: 'roadmap', referenceId: new mongoose.Types.ObjectId() });
    const res = await request(app).put(`/feedback/reviews/${review._id}`)
      .set('token', token).send({ total_stars: 1 });
    expect(res.status).toBe(404);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('DELETE /feedback/reviews/:id  (admin only)', () => {
  it('200 – admin deletes any review', async () => {
    const user   = await seedUser();
    const admin  = await seedAdmin();
    const token  = makeAdminToken(admin._id.toString());
    const review = await Review.create({ user: user._id, rating: 2, comment: 'bad', relatedTo: 'step', referenceId: new mongoose.Types.ObjectId() });
    const res = await request(app).delete(`/feedback/reviews/${review._id}`).set('token', token);
    expect(res.status).toBe(200);
    expect(await Review.findById(review._id)).toBeNull();
  });

  it('403 – regular user cannot delete reviews', async () => {
    const user   = await seedUser();
    const token  = makeUserToken(user._id.toString());
    const review = await Review.create({ user: user._id, rating: 1, comment: 'bad', relatedTo: 'step', referenceId: new mongoose.Types.ObjectId() });
    const res = await request(app).delete(`/feedback/reviews/${review._id}`).set('token', token);
    expect(res.status).toBe(403);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
//  REPORTS  (/feedback/reports)
// ══════════════════════════════════════════════════════════════════════════════
describe('POST /feedback/reports  (authenticated)', () => {
  it('201 – authenticated user files a report', async () => {
    const user  = await seedUser();
    const token = makeUserToken(user._id.toString());
    const res   = await request(app).post('/feedback/reports').set('token', token).send(validReportBody);
    expect(res.status).toBe(201);
    expect(res.body.data.status).toBe('pending');
  });

  it('401 – unauthenticated report rejected', async () => {
    const res = await request(app).post('/feedback/reports').send(validReportBody);
    expect(res.status).toBe(401);
  });

  it('422 – missing title', async () => {
    const user  = await seedUser();
    const token = makeUserToken(user._id.toString());
    const { title: _, ...body } = validReportBody;
    const res = await request(app).post('/feedback/reports').set('token', token).send(body);
    expect(res.status).toBe(422);
  });

  it('422 – invalid type enum value', async () => {
    const user  = await seedUser();
    const token = makeUserToken(user._id.toString());
    const res = await request(app).post('/feedback/reports').set('token', token)
      .send({ ...validReportBody, type: 'wrong_type' });
    expect(res.status).toBe(422);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('GET /feedback/reports  (admin only)', () => {
  it('200 – admin retrieves all reports', async () => {
    const user  = await seedUser();
    const admin = await seedAdmin();
    const token = makeAdminToken(admin._id.toString());
    await Report.create({ user: user._id, reason: 'test', relatedTo: 'step', referenceId: new mongoose.Types.ObjectId(), status: 'pending' });
    const res = await request(app).get('/feedback/reports').set('token', token);
    expect(res.status).toBe(200);
    expect(res.body.results).toBe(1);
  });

  it('403 – regular user cannot list reports', async () => {
    const user  = await seedUser();
    const token = makeUserToken(user._id.toString());
    const res   = await request(app).get('/feedback/reports').set('token', token);
    expect(res.status).toBe(403);
  });

  it('401 – unauthenticated cannot list reports', async () => {
    const res = await request(app).get('/feedback/reports');
    expect(res.status).toBe(401);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('PATCH /feedback/reports/:id  (admin only)', () => {
  it('200 – admin resolves a report', async () => {
    const user   = await seedUser();
    const admin  = await seedAdmin();
    const token  = makeAdminToken(admin._id.toString());
    const report = await Report.create({ user: user._id, reason: 'spam', relatedTo: 'step', referenceId: new mongoose.Types.ObjectId(), status: 'pending' });
    const res = await request(app).patch(`/feedback/reports/${report._id}`).set('token', token).send({ status: 'resolved' });
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('resolved');
  });

  it('400 – invalid status value rejected', async () => {
    const user   = await seedUser();
    const admin  = await seedAdmin();
    const token  = makeAdminToken(admin._id.toString());
    const report = await Report.create({ user: user._id, reason: 'spam', relatedTo: 'step', referenceId: new mongoose.Types.ObjectId(), status: 'pending' });
    const res = await request(app).patch(`/feedback/reports/${report._id}`).set('token', token).send({ status: 'invalid_status' });
    expect(res.status).toBe(400);
  });

  it('404 – patching non-existent report', async () => {
    const admin = await seedAdmin();
    const token = makeAdminToken(admin._id.toString());
    const res   = await request(app).patch(`/feedback/reports/${new mongoose.Types.ObjectId()}`).set('token', token).send({ status: 'resolved' });
    expect(res.status).toBe(404);
  });
});
