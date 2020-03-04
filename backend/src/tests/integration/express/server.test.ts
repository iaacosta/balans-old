import request from 'supertest';
import bcrypt from 'bcrypt';
import { createConnection } from 'typeorm';

import app from '../../..';

console.log = jest.fn();

describe('app', () => {
  let compare: jest.SpyInstance;

  it('should accept requests', async () => {
    const res = await request(app).get('/');
    expect(res).not.toBeUndefined();
  });

  describe('authentication', () => {
    it('should respond status 401 and error if try POST /graphql without token', async () => {
      const { body, status } = await request(app)
        .post('/graphql')
        .send({});

      expect(status).toBe(401);
      expect(body.errors).not.toBeUndefined();
    });

    it('should respond status 401 and error if try POST /graphql with wrong token type', async () => {
      const { body, status } = await request(app)
        .post('/graphql')
        .set('Authorization', 'Any token')
        .send({});

      expect(status).toBe(401);
      expect(body.errors).not.toBeUndefined();
    });

    it('should respond status 401 and error if try POST /graphql with empty password', async () => {
      const { body, status } = await request(app)
        .post('/graphql')
        .set('Authorization', 'Password ')
        .send({});

      expect(status).toBe(401);
      expect(body.errors).not.toBeUndefined();
    });

    it('should respond status 401 and error if try POST /graphql with wrong password', async () => {
      const { body, status } = await request(app)
        .post('/graphql')
        .set('Authorization', 'Password asd')
        .send({});

      expect(status).toBe(401);
      expect(body.errors).not.toBeUndefined();
    });

    it('should respond status 401 and error if try POST /graphql and compare fails', async () => {
      compare = jest.spyOn(bcrypt, 'compare').mockImplementation(() => {
        throw new Error();
      });

      const { body, status } = await request(app)
        .post('/graphql')
        .set('Authorization', 'Password asd')
        .send({});

      expect(status).toBe(401);
      expect(body.errors).not.toBeUndefined();
    });

    it('should respond status 200 if try POST /graphql with "correct password"', async () => {
      const connection = await createConnection();
      compare = jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(true));

      const { body, status } = await request(app)
        .post('/graphql')
        .set('Authorization', 'Password 232d1cd9fa')
        .send({
          query: '{ getCurrencies { id name } }',
        });

      expect(status).toBe(200);
      expect(body.errors).toBeUndefined();
      compare.mockReset();
      connection.close();
    });
  });
});
