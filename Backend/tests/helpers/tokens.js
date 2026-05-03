import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);
config({ path: resolve(__dirname, '../../.env') });

const signToken = (payload, secretKey) => jwt.sign(payload, secretKey || 'test_fallback_secret', { expiresIn: '1d' });

export const makeUserToken = (id, role = 'user') =>
  signToken({ id, _id: id, role }, process.env.SECRET_ACCESS_TOKEN);

export const makeAdminToken = (id) =>
  signToken({ id, _id: id, role: 'admin' }, process.env.SECRET_ACCESS_TOKEN);

export const makeSuperAdminToken = (id) =>
  signToken({ id, _id: id, role: 'superAdmin', isSuperAdmin: true }, process.env.SECRET_ACCESS_TOKEN);

export const makeReviewerToken = (id) =>
  signToken({ id, _id: id, role: 'reviewer' }, process.env.ACCESS_TOKEN_SECRET);