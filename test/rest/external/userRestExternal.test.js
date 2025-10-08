// bibliotecas
const request = require('supertest');
const { expect } = require('chai');

// aplicação
const app = require('../../../rest/app');
const userService = require('../../../src/services/userService');


// testes 
describe('Login REST External', () => {
    describe('POST /api/users/login', () => {
        it('Teste 7 External - Quando uso dados válidos o retorno é 200 ', async () => {
            const resposta = await request('http://localhost:3000')
                 .post('/api/users/login')
                 .send({
                        "email": "alice@email.com",
                        "password": "123456"
                 });

             expect(resposta.status).to.equal(200);   
        }); 
   });      
});        