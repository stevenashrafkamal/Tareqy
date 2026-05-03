import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import mongoose from 'mongoose';
import app from '../app.js';
import request from 'supertest';
import { User } from '../Database/models/user.js';
import Track from '../Database/models/track.model.js';
import Report from '../Modules/feedback/report/report.model.js';
import Review from '../Modules/feedback/review/review.model.js';
import Submission from '../Database/models/submission.model.js';
import Instructor from '../Database/models/instructor.model.js';
import { makeUserToken, makeAdminToken, makeSuperAdminToken } from './helpers/tokens.js';

const TEST_DB = 'mongodb://localhost:27017/tareqy_test';

beforeAll(async () => { await mongoose.connect(TEST_DB); });
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});
beforeEach(async () => {
  await User.deleteMany({});
  await Track.deleteMany({});
  await Report.deleteMany({});
  await Review.deleteMany({});
  await Submission.deleteMany({});
  await Instructor.deleteMany({});
});

// Setup mock users and tokens
const adminId = new mongoose.Types.ObjectId();
const sAdminId = new mongoose.Types.ObjectId();
const userId = new mongoose.Types.ObjectId();

const adminToken = makeAdminToken(adminId.toString());
const sAdminToken = makeSuperAdminToken(sAdminId.toString());
const userToken = makeUserToken(userId.toString());

describe('Admin Module Endpoints', () => {

  describe('Users Administration', () => {
    it('GET /api/admin/users – list all users', async () => {
      await User.create({ _id: userId, username: 'testuser', email: 'u@test.com', password: 'password123', isConfirmed: true });
      const res = await request(app).get('/api/admin/users').set('token', adminToken);
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
    });

    it('PATCH /api/admin/users/:id/ban – ban a user', async () => {
      await User.create({ _id: userId, username: 'banuser', email: 'ban_user@x.com', password: 'password123' });
      const res = await request(app).patch(`/api/admin/users/${userId}/ban`).set('token', adminToken);
      expect(res.status).toBe(200);
      expect(res.body.data.account_status).toBe('banned');
    });

    it('PATCH /api/admin/users/:id/activate – activate a user', async () => {
      await User.create({ _id: userId, username: 'actuser', email: 'active_user@x.com', password: 'password123', account_status: 'banned' });
      const res = await request(app).patch(`/api/admin/users/${userId}/activate`).set('token', adminToken);
      expect(res.status).toBe(200);
      expect(res.body.data.account_status).toBe('active');
    });

    it('PATCH /api/admin/users/:id/role – change role (Super Admin only)', async () => {
      await User.create({ _id: userId, username: 'u2', email: 'user_two@x.com', password: 'password123', role: 'user' });
      
      const failRes = await request(app).patch(`/api/admin/users/${userId}/role`).set('token', adminToken).send({ role: 'admin' });
      expect(failRes.status).toBe(403);
      
      const res = await request(app).patch(`/api/admin/users/${userId}/role`).set('token', sAdminToken).send({ role: 'admin' });
      expect(res.status).toBe(200);
      expect(res.body.data.role).toBe('admin');
    });
  });

  describe('Tracks Administration', () => {
    const trackPayload = { title: "New Track", type: "develop" };
    
    it('POST /api/admin/tracks – creates a track', async () => {
      const res = await request(app).post('/api/admin/tracks').set('token', adminToken).send(trackPayload);
      expect(res.status).toBe(201);
      expect(res.body.data.title).toBe(trackPayload.title);
    });

    it('DELETE /api/admin/tracks/:id – deletes a track', async () => {
      const tr = await Track.create({ _id: new mongoose.Types.ObjectId(), title: "Del Track" });
      const res = await request(app).delete(`/api/admin/tracks/${tr._id}`).set('token', adminToken);
      expect(res.status).toBe(204);
      
      const found = await Track.findById(tr._id);
      expect(found).toBeNull();
    });
  });

  describe('Reports / Reviews Administration', () => {
    it('GET /api/admin/reports – list all reports', async () => {
      await Report.create({ user: userId, reason: "Bug", relatedTo: "step", referenceId: new mongoose.Types.ObjectId() });
      const res = await request(app).get('/api/admin/reports').set('token', adminToken);
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
    });

    it('PATCH /api/admin/reports/:id/resolve – resolves a report', async () => {
      const rep = await Report.create({ user: userId, reason: "Bug", relatedTo: "step", referenceId: new mongoose.Types.ObjectId() });
      const res = await request(app).patch(`/api/admin/reports/${rep._id}/resolve`).set('token', adminToken);
      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('resolved');
    });

    it('DELETE /api/admin/reviews/:id – delete a review', async () => {
      const rev = await Review.create({ user: userId, relatedTo: "step", referenceId: new mongoose.Types.ObjectId(), comment: "Bad", rating: 1 });
      const res = await request(app).delete(`/api/admin/reviews/${rev._id}`).set('token', adminToken);
      expect(res.status).toBe(204);
      
      const found = await Review.findById(rev._id);
      expect(found).toBeNull();
    });
  });

  describe('Instructors & Submissions', () => {
    it('GET /api/admin/submissions – list all submissions', async () => {
      await Submission.create({ userId, challengeId: new mongoose.Types.ObjectId(), submissionUrl: "http", type: "challenge", fileType: "file" });
      const res = await request(app).get('/api/admin/submissions').set('token', adminToken);
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
    });

    it('GET /api/admin/instructors/pending – list pending instructors', async () => {
      await Instructor.create({ userId: new mongoose.Types.ObjectId(), username: 'inst1', email: 'inst1@x.com', password: 'password123', bio: "Me", accountStatus: "pending" });
      const res = await request(app).get('/api/admin/instructors/pending').set('token', adminToken);
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
    });

    it('PATCH /api/admin/instructors/:id/approve – approve instructor', async () => {
      const inst = await Instructor.create({ userId: new mongoose.Types.ObjectId(), username: 'inst2', email: 'inst2@x.com', password: 'password123', bio: "Me", accountStatus: "pending" });
      const res = await request(app).patch(`/api/admin/instructors/${inst._id}/approve`).set('token', adminToken);
      expect(res.status).toBe(200);
      expect(res.body.data.accountStatus).toBe('approved');
    });

    it('PATCH /api/admin/instructors/:id/reject – reject instructor', async () => {
      const inst = await Instructor.create({ userId: new mongoose.Types.ObjectId(), username: 'inst3', email: 'inst3@x.com', password: 'password123', bio: "Me", accountStatus: "pending" });
      const res = await request(app).patch(`/api/admin/instructors/${inst._id}/reject`).set('token', adminToken);
      expect(res.status).toBe(200);
      expect(res.body.data.accountStatus).toBe('rejected');
    });
  });

});
