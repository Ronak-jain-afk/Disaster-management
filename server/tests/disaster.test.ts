import request from 'supertest';
import app from '../src/app';
import mongoose from 'mongoose';
import User from '../src/models/User';
import Disaster from '../src/models/Disaster';

let adminToken: string;
let adminId: string;

beforeAll(async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/emergency-alerts-test';
  await mongoose.connect(uri);
});

beforeEach(async () => {
  await User.deleteMany({});
  await Disaster.deleteMany({});

  const res = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
    });
  adminToken = res.body.data.token;
  adminId = res.body.data.user.id;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('Disaster API', () => {
  const testDisaster = {
    name: 'Test Flood',
    type: 'flood',
    description: 'Severe flooding in the area',
    location: {
      type: 'Point',
      coordinates: [72.8777, 19.0760],
    },
    severity: 'high',
  };

  describe('POST /api/disasters', () => {
    it('should create a disaster (admin)', async () => {
      const res = await request(app)
        .post('/api/disasters')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(testDisaster)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe(testDisaster.name);
    });

    it('should reject without token', async () => {
      await request(app).post('/api/disasters').send(testDisaster).expect(401);
    });
  });

  describe('GET /api/disasters', () => {
    it('should list disasters', async () => {
      await request(app)
        .post('/api/disasters')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(testDisaster);

      const res = await request(app)
        .get('/api/disasters')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(1);
    });
  });

  describe('GET /api/disasters/:id', () => {
    it('should get a specific disaster', async () => {
      const createRes = await request(app)
        .post('/api/disasters')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(testDisaster);

      const res = await request(app)
        .get(`/api/disasters/${createRes.body.data._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.data.name).toBe(testDisaster.name);
    });
  });
});
