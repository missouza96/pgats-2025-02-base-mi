// bibliotecas
const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');

// aplicação
const app = require('../../../rest/app');
const { it } = require('mocha');

// testes 
describe('Login REST Controller', () => {
    describe('POST /api/users/login', () => {
        it('Quando uso dados validos o retorno é 200', async () => {
            const resposta = await request(app)
                 .post('/api/users/login')
                 .send({
                        "email": "alice@email.com",
                        "password": "123456"
                 });

             expect(resposta.status).to.equal(200);   //chai
        });
    });

    describe('POST /api/users/login', () => {
		it('Quando uso dados invalidos o retorno é 401', async () => {
            const resposta = await request(app)
                 .post('/api/users/login')
                 .send({
                        "email": "1234@email.com",
                        "password": "1"
                 });

             expect(resposta.status).to.equal(401);   //chai
             expect(resposta.body).to.have.property('error','Credenciais inválidas')
        });
    });


});