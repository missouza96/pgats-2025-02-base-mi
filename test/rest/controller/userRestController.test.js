// bibliotecas
const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');
const { it } = require('mocha');

// aplicação
const app = require('../../../rest/app');
const userService = require('../../../src/services/userService');

// testes 
describe('Login REST Controller', () => {
    describe('POST /api/users/login', () => {
        it('Teste 2 - Quando uso dados válidos o retorno é 200', async () => {
            const resposta = await request(app)
                 .post('/api/users/login')
                 .send({
                        "email": "alice@email.com",
                        "password": "123456"
                 });

             expect(resposta.status).to.equal(200);   //chai
        });  
        
        it('Teste 3 - Quando uso dados invalidos o retorno é 401', async () => {
            const resposta = await request(app)
                 .post('/api/users/login')
                 .send({
                        "email": "1234@email.com",
                        "password": "1"
                 });

             expect(resposta.status).to.equal(401);   
             expect(resposta.body).to.have.property('error','Credenciais inválidas')
        });
    });
});

describe('Register REST Controller', () => {
    describe('POST /api/users/register', () => {
        it('Teste 4 - Quando uso dados validos o retorno é 201', async () => {
            const resposta = await request(app)
                 .post('/api/users/register')
                 .send({
                        "name": "milena",
                        "email": "milena@email.com",
                        "password": "123456"
                    });

             expect(resposta.status).to.equal(201);   
        });

        it('Teste 5 - Quando uso dados já cadastrados o retorno é 400', async () => {
            const resposta = await request(app)
                 .post('/api/users/register')
                 .send({
                        "name": "Alice",
                        "email": "alice@email.com",
                        "password": "123456"
                    });

             expect(resposta.status).to.equal(400);  
        });
        
         it('Teste 6 - Usando mocks - Quando uso dados invalidos o retorno é 401', async () => {
            const userServiceMock = sinon.stub(userService, 'registerUser'); //sinon
            userServiceMock.throws(new Error('Credenciais inválidas'));

            const resposta = await request(app)
                 .post('/api/users/login')
                 .send({
                        "name": "string",
                        "email": "string",
                        "password": "string"
                    });

             expect(resposta.status).to.equal(401);   
             expect(resposta.body).to.have.property('error','Credenciais inválidas');
             userServiceMock.restore();
        });
    });
});