import supertest from 'supertest';
import server from '../modules/app';

describe('create new user', () => {
  it('return status 200', () => {
    const user = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'user@mail.com',
      password: '@@123456##'
    };

    supertest(server).post('/api/v1/users', (error, res) => {
    
    });
  });
});
