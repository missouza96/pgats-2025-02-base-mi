// bibliotecas
const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');
const { it } = require('mocha');

// aplicação
const app = require('../../../rest/app');


// testes 
describe('Checkout REST Controller', () => {
    describe('POST /api/checkout', () => {
        it('Teste 1 - Quando o token é inválido o retorno é 401', async () => {
            const resposta = await request(app)
                 .post('/api/checkout')
                 .send({
                        "items": [
                            {
                            "productId": 0,
                            "quantity": 0
                            }
                        ],
                        "freight": 0,
                        "paymentMethod": "boleto",
                        "cardData": {
                            "number": "string",
                            "name": "string",
                            "expiry": "string",
                            "cvv": "string"
                        }
                });
             expect(resposta.status).to.equal(401);   //chai
             expect(resposta.body).to.have.property('error','Token inválido')
        });
    });
});