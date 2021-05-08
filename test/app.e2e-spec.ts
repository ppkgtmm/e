import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { ErrorFilter, exceptionFactory } from '../src/exception';
import { getConnection } from 'typeorm';
import { testOverlapResponse } from './../test/functions';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        exceptionFactory,
      }),
    );
    app.useGlobalFilters(new ErrorFilter());
    await app.init();
  });

  it('should create event', () => {
    return request(app.getHttpServer())
      .post('/api/event/')
      .send({
        notes: 'abcd',
        date: 3,
        month: 1,
        year: 2021,
        start_hour: 10,
        start_minute: 0,
        end_hour: 11,
        end_minute: 0,
        repeat_interval: null,
      })
      .expect(201);
  });
  it('should create event', () => {
    return request(app.getHttpServer())
      .post('/api/event/')
      .send({
        notes: 'abcd',
        date: 7,
        month: 1,
        year: 2021,
        start_hour: 10,
        start_minute: 0,
        end_hour: 11,
        end_minute: 0,
        repeat_interval: null,
      })
      .expect(201);
  });
  it('should create event', () => {
    return request(app.getHttpServer())
      .post('/api/event/')
      .send({
        notes: 'abcd',
        date: 3,
        month: 4,
        year: 2021,
        start_hour: 10,
        start_minute: 0,
        end_hour: 11,
        end_minute: 0,
        repeat_interval: null,
      })
      .expect(201);
  });
  it('should create event', () => {
    return request(app.getHttpServer())
      .post('/api/event/')
      .send({
        notes: 'abcd',
        date: 3,
        month: 1,
        year: 2022,
        start_hour: 10,
        start_minute: 0,
        end_hour: 11,
        end_minute: 0,
        repeat_interval: null,
      })
      .expect(201);
  });
  it('should not create event', () => {
    return request(app.getHttpServer())
      .post('/api/event/')
      .send({
        notes: 'abcd',
        date: 3,
        month: 4,
        year: 2021,
        start_hour: 10,
        start_minute: 0,
        end_hour: 11,
        end_minute: 0,
        repeat_interval: null,
      })
      .expect(400)
      .expect(({ body }) => {
        testOverlapResponse(body);
      });
  });
  it('should create event', () => {
    return request(app.getHttpServer())
      .post('/api/event/')
      .send({
        notes: 'abcd',
        date: 31,
        month: 1,
        year: 2021,
        start_hour: 11,
        start_minute: 0,
        end_hour: 12,
        end_minute: 0,
        repeat_interval: 'monthly',
      })
      .expect(201);
  });
  it('should not create event', () => {
    return request(app.getHttpServer())
      .post('/api/event/')
      .send({
        notes: 'abcd',
        date: 28,
        month: 2,
        year: 2021,
        start_hour: 11,
        start_minute: 0,
        end_hour: 12,
        end_minute: 0,
        repeat_interval: 'monthly',
      })
      .expect(400)
      .expect(({ body }) => {
        testOverlapResponse(body);
      });
  });
  it('should not create event', () => {
    return request(app.getHttpServer())
      .post('/api/event/')
      .send({
        notes: 'abcd',
        date: 31,
        month: 1,
        year: 2022,
        start_hour: 11,
        start_minute: 0,
        end_hour: 12,
        end_minute: 0,
        repeat_interval: null,
      })
      .expect(400)
      .expect(({ body }) => {
        testOverlapResponse(body);
      });
  });

  it('should create event', () => {
    return request(app.getHttpServer())
      .post('/api/event/')
      .send({
        notes: 'abcd',
        date: 4,
        month: 2,
        year: 2021,
        start_hour: 13,
        start_minute: 0,
        end_hour: 14,
        end_minute: 0,
        repeat_interval: 'daily',
      })
      .expect(201);
  });

  it('should not create event', () => {
    return request(app.getHttpServer())
      .post('/api/event/')
      .send({
        notes: 'abcd',
        date: 5,
        month: 2,
        year: 2021,
        start_hour: 13,
        start_minute: 0,
        end_hour: 14,
        end_minute: 0,
        repeat_interval: 'weekly',
      })
      .expect(400)
      .expect(({ body }) => {
        testOverlapResponse(body);
      });
  });

  it('should not create event', () => {
    return request(app.getHttpServer())
      .post('/api/event/')
      .send({
        notes: 'abcd',
        date: 4,
        month: 3,
        year: 2021,
        start_hour: 13,
        start_minute: 0,
        end_hour: 14,
        end_minute: 0,
        repeat_interval: 'weekly',
      })
      .expect(400)
      .expect(({ body }) => {
        testOverlapResponse(body);
      });
  });

  it('should not create event', () => {
    return request(app.getHttpServer())
      .post('/api/event/')
      .send({
        notes: 'abcd',
        date: 4,
        month: 2,
        year: 2022,
        start_hour: 13,
        start_minute: 0,
        end_hour: 14,
        end_minute: 0,
        repeat_interval: 'weekly',
      })
      .expect(400)
      .expect(({ body }) => {
        testOverlapResponse(body);
      });
  });

  it('should not create event', () => {
    return request(app.getHttpServer())
      .post('/api/event/')
      .send({
        notes: 'abcd',
        date: 18,
        month: 2,
        year: 2021,
        start_hour: 13,
        start_minute: 0,
        end_hour: 14,
        end_minute: 0,
        repeat_interval: 'daily',
      })
      .expect(400)
      .expect(({ body }) => {
        testOverlapResponse(body);
      });
  });

  it('should create event', () => {
    return request(app.getHttpServer())
      .post('/api/event/')
      .send({
        notes: 'abcd',
        date: 26,
        month: 3,
        year: 2021,
        start_hour: 15,
        start_minute: 0,
        end_hour: 16,
        end_minute: 0,
        repeat_interval: 'yearly',
      })
      .expect(201);
  });

  it('should not create event', () => {
    return request(app.getHttpServer())
      .post('/api/event/')
      .send({
        notes: 'abcd',
        date: 26,
        month: 3,
        year: 2022,
        start_hour: 15,
        start_minute: 0,
        end_hour: 16,
        end_minute: 0,
        repeat_interval: 'weekly',
      })
      .expect(400)
      .expect(({ body }) => {
        testOverlapResponse(body);
      });
  });

  it('should create event', () => {
    return request(app.getHttpServer())
      .post('/api/event/')
      .send({
        notes: 'abcd',
        date: 21,
        month: 1,
        year: 2021,
        start_hour: 17,
        start_minute: 0,
        end_hour: 18,
        end_minute: 0,
        repeat_interval: 'weekly',
      })
      .expect(201);
  });

  it('should not create event', () => {
    return request(app.getHttpServer())
      .post('/api/event/')
      .send({
        notes: 'abcd',
        date: 28,
        month: 1,
        year: 2021,
        start_hour: 17,
        start_minute: 0,
        end_hour: 18,
        end_minute: 0,
        repeat_interval: null,
      })
      .expect(400)
      .expect(({ body }) => {
        testOverlapResponse(body);
      });
  });

  it('should not create event', () => {
    return request(app.getHttpServer())
      .post('/api/event/')
      .send({
        notes: 'abcd',
        date: 21,
        month: 10,
        year: 2021,
        start_hour: 17,
        start_minute: 0,
        end_hour: 18,
        end_minute: 0,
        repeat_interval: null,
      })
      .expect(400)
      .expect(({ body }) => {
        testOverlapResponse(body);
      });
  });

  it('should not create event', () => {
    return request(app.getHttpServer())
      .post('/api/event/')
      .send({
        notes: 'abcd',
        date: 21,
        month: 1,
        year: 2027,
        start_hour: 17,
        start_minute: 0,
        end_hour: 18,
        end_minute: 0,
        repeat_interval: 'daily',
      })
      .expect(400)
      .expect(({ body }) => {
        testOverlapResponse(body);
      });
  });

  it('should create event', () => {
    return request(app.getHttpServer())
      .post('/api/event/')
      .send({
        notes: 'abcd',
        date: 25,
        month: 11,
        year: 2022,
        start_hour: 9,
        start_minute: 0,
        end_hour: 9,
        end_minute: 30,
        repeat_interval: 'yearly',
      })
      .expect(201);
  });

  it('should not create event', () => {
    return request(app.getHttpServer())
      .post('/api/event/')
      .send({
        notes: 'abcd',
        date: 25,
        month: 12,
        year: 2021,
        start_hour: 9,
        start_minute: 0,
        end_hour: 9,
        end_minute: 30,
        repeat_interval: 'monthly',
      })
      .expect(400)
      .expect(({ body }) => {
        testOverlapResponse(body);
      });
  });

  it('should not create event', () => {
    return request(app.getHttpServer())
      .post('/api/event/')
      .send({
        notes: 'abcd',
        date: 25,
        month: 11,
        year: 2023,
        start_hour: 9,
        start_minute: 0,
        end_hour: 9,
        end_minute: 30,
        repeat_interval: null,
      })
      .expect(400)
      .expect(({ body }) => {
        testOverlapResponse(body);
      });
  });

  it('should create event', () => {
    return request(app.getHttpServer())
      .post('/api/event/')
      .send({
        notes: 'abcd',
        date: 31,
        month: 8,
        year: 2021,
        start_hour: 9,
        start_minute: 30,
        end_hour: 10,
        end_minute: 0,
        repeat_interval: 'monthly',
      })
      .expect(201);
  });

  it('should not create event', () => {
    return request(app.getHttpServer())
      .post('/api/event/')
      .send({
        notes: 'abcd',
        date: 31,
        month: 8,
        year: 2022,
        start_hour: 9,
        start_minute: 30,
        end_hour: 10,
        end_minute: 0,
        repeat_interval: 'weekly',
      })
      .expect(400)
      .expect(({ body }) => {
        testOverlapResponse(body);
      });
  });

  it('should not create event', () => {
    return request(app.getHttpServer())
      .post('/api/event/')
      .send({
        notes: 'abcd',
        date: 30,
        month: 9,
        year: 2021,
        start_hour: 9,
        start_minute: 30,
        end_hour: 10,
        end_minute: 0,
        repeat_interval: null,
      })
      .expect(400)
      .expect(({ body }) => {
        testOverlapResponse(body);
      });
  });

  it('should create event', () => {
    return request(app.getHttpServer())
      .post('/api/event/')
      .send({
        notes: 'abcd',
        date: 5,
        month: 1,
        year: 2022,
        start_hour: 18,
        start_minute: 0,
        end_hour: 19,
        end_minute: 0,
        repeat_interval: 'weekly',
      })
      .expect(201);
  });

  it('should not create event', () => {
    return request(app.getHttpServer())
      .post('/api/event/')
      .send({
        notes: 'abcd',
        date: 5,
        month: 1,
        year: 2021,
        start_hour: 18,
        start_minute: 0,
        end_hour: 19,
        end_minute: 0,
        repeat_interval: 'yearly',
      })
      .expect(400)
      .expect(({ body }) => {
        testOverlapResponse(body);
      });
  });

  it('should not create event', () => {
    return request(app.getHttpServer())
      .post('/api/event/')
      .send({
        notes: 'abcd',
        date: 5,
        month: 12,
        year: 2021,
        start_hour: 18,
        start_minute: 0,
        end_hour: 19,
        end_minute: 0,
        repeat_interval: 'monthly',
      })
      .expect(400)
      .expect(({ body }) => {
        testOverlapResponse(body);
      });
  });

  it('should not create event', () => {
    return request(app.getHttpServer())
      .post('/api/event/')
      .send({
        notes: 'abcd',
        date: 8,
        month: 12,
        year: 2021,
        start_hour: 18,
        start_minute: 0,
        end_hour: 19,
        end_minute: 0,
        repeat_interval: 'daily',
      })
      .expect(400)
      .expect(({ body }) => {
        testOverlapResponse(body);
      });
  });

  it('should not create event', () => {
    return request(app.getHttpServer())
      .post('/api/event/')
      .send({
        notes: 'abcd',
        date: 8,
        month: 12,
        year: 2021,
        start_hour: 18,
        start_minute: 0,
        end_hour: 19,
        end_minute: 0,
        repeat_interval: 'weekly',
      })
      .expect(400)
      .expect(({ body }) => {
        testOverlapResponse(body);
      });
  });

  it('should create event', () => {
    return request(app.getHttpServer())
      .post('/api/event/')
      .send({
        notes: 'abcd',
        date: 2,
        month: 1,
        year: 2022,
        start_hour: 19,
        start_minute: 0,
        end_hour: 20,
        end_minute: 0,
        repeat_interval: 'daily',
      })
      .expect(201);
  });

  it('should not create event', () => {
    return request(app.getHttpServer())
      .post('/api/event/')
      .send({
        notes: 'abcd',
        date: 19,
        month: 12,
        year: 2021,
        start_hour: 19,
        start_minute: 0,
        end_hour: 20,
        end_minute: 0,
        repeat_interval: 'weekly',
      })
      .expect(400)
      .expect(({ body }) => {
        testOverlapResponse(body);
      });
  });

  it('should not create event', () => {
    return request(app.getHttpServer())
      .post('/api/event/')
      .send({
        notes: 'abcd',
        date: 2,
        month: 1,
        year: 2021,
        start_hour: 19,
        start_minute: 0,
        end_hour: 20,
        end_minute: 0,
        repeat_interval: 'yearly',
      })
      .expect(400)
      .expect(({ body }) => {
        testOverlapResponse(body);
      });
  });

  it('should not create event', () => {
    return request(app.getHttpServer())
      .post('/api/event/')
      .send({
        notes: 'abcd',
        date: 2,
        month: 9,
        year: 2021,
        start_hour: 19,
        start_minute: 0,
        end_hour: 20,
        end_minute: 0,
        repeat_interval: 'monthly',
      })
      .expect(400)
      .expect(({ body }) => {
        testOverlapResponse(body);
      });
  });

  it('should not create event', () => {
    return request(app.getHttpServer())
      .post('/api/event/')
      .send({
        notes: 'abcd',
        date: 31,
        month: 12,
        year: 2021,
        start_hour: 19,
        start_minute: 0,
        end_hour: 20,
        end_minute: 0,
        repeat_interval: 'daily',
      })
      .expect(400)
      .expect(({ body }) => {
        testOverlapResponse(body);
      });
  });

  it('should fetch event on the date', () => {
    return request(app.getHttpServer())
      .get('/api/event/by/date/')
      .send({
        date: 7,
        month: 1,
        year: 2022,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toBeDefined();
        expect(body).toHaveLength(2);
        for (const event of body) {
          expect(event).toBeDefined();
          expect(event.repeat_interval).toBeDefined();
          expect(event.repeat_interval).toEqual('daily');
        }
      });
  });
  it('should fetch event during the week', () => {
    return request(app.getHttpServer())
      .get('/api/event/by/week/')
      .send({
        date: 25,
        month: 2,
        year: 2021,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toBeDefined();
        expect(body).toHaveLength(2);
      });
  });

  afterAll(async () => {
    await getConnection().close();
    await app.close();
  });
});
