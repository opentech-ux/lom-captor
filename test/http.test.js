import 'regenerator-runtime/runtime';
import { GET, POST } from '../src/modules/http';

global.fetch = require('node-fetch');

jest.setTimeout(120000);

describe('API testing', () => {
   describe('fetchAPI function', () => {
      it('Should get data only with the endpoint parameter', async () => {
         const response = await GET('sites/5e4fde83abd9376955d648bf')
            .then((resp) => resp)
            .catch((err) => err);

         expect(response).not.toBe(null);
         expect(response).not.toBe({});
         expect(response).not.toBe(false);
         expect(response).toEqual(expect.any(Object));
         expect(response).toEqual(
            expect.objectContaining({
               data: {
                  _id: '5e4fde83abd9376955d648bf',
                  fields: { host: 'localhost:8082' },
                  createdAt: '2020-02-21T13:43:31.235Z',
                  updatedAt: '2020-02-21T13:43:31.235Z',
                  user: '5db53c1a7ffbd672547a9bb2',
               },
               message: 'Site retrieved successfully.',
               success: true,
               type: 'resource',
            })
         );
      });

      it("Should handle http method's error and return it", async () => {
         const response = await GET('non-existent-endpoint')
            .then((resp) => resp)
            .catch((err) => err);

         expect(response).not.toBe(null);
         expect(response).not.toBe(false);
         expect(response).toEqual(expect.any(Object));
         expect(response).toEqual(
            expect.objectContaining({
               error: 'Not Found',
               message: 'Cannot GET /non-existent-endpoint',
               statusCode: 404,
            })
         );
      });

      it('Should get data with all the parameters', async () => {
         const response = await POST('https://reqres.in/api/users', {
            name: 'morpheus',
            job: 'leader',
         })
            .then((resp) => resp)
            .catch((err) => err);

         expect(response).not.toBe(null);
         expect(response).not.toBe({});
         expect(response).not.toBe(false);
         expect(response).toEqual(expect.any(Object));
      });
   });
});
