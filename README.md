# API Checkout Rest e GraphQL

Se você é aluno da Pós-Graduação em Automação de Testes de Software (Turma 2), faça um fork desse repositório e boa sorte em seu trabalho de conclusão da disciplina.

## Instalação

```bash
npm install express jsonwebtoken swagger-ui-express apollo-server-express graphql
```

## Exemplos de chamadas

### REST

#### Registro de usuário
```bash
curl -X POST http://localhost:3000/api/users/register \
	-H "Content-Type: application/json" \
	-d '{"name":"Novo Usuário","email":"novo@email.com","password":"senha123"}'
```

#### Login
```bash
curl -X POST http://localhost:3000/api/users/login \
	-H "Content-Type: application/json" \
	-d '{"email":"novo@email.com","password":"senha123"}'
```

#### Checkout (boleto)
```bash
curl -X POST http://localhost:3000/api/checkout \
	-H "Content-Type: application/json" \
	-H "Authorization: Bearer <TOKEN_JWT>" \
	-d '{
		"items": [{"productId":1,"quantity":2}],
		"freight": 20,
		"paymentMethod": "boleto"
	}'
```

#### Checkout (cartão de crédito)
```bash
curl -X POST http://localhost:3000/api/checkout \
	-H "Content-Type: application/json" \
	-H "Authorization: Bearer <TOKEN_JWT>" \
	-d '{
		"items": [{"productId":2,"quantity":1}],
		"freight": 15,
		"paymentMethod": "credit_card",
		"cardData": {
			"number": "4111111111111111",
			"name": "Nome do Titular",
			"expiry": "12/30",
			"cvv": "123"
		}
	}'
```

### GraphQL

#### Registro de usuário
Mutation:
```graphql
mutation Register($name: String!, $email: String!, $password: String!) {
  register(name: $name, email: $email, password: $password) {
    email
    name
  }
}

Variables:
{
  "name": "Julio",
  "email": "julio@abc.com",
  "password": "123456"
}
```

#### Login
Mutation:
```graphql
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
  }
}

Variables:
{
  "email": "alice@email.com",
  "password": "123456"
}
```


#### Checkout (boleto)
Mutation (envie o token JWT no header Authorization: Bearer <TOKEN_JWT>):
```graphql
mutation Checkout($items: [CheckoutItemInput!]!, $freight: Float!, $paymentMethod: String!, $cardData: CardDataInput) {
  checkout(items: $items, freight: $freight, paymentMethod: $paymentMethod, cardData: $cardData) {
    freight
    items {
      productId
      quantity
    }
    paymentMethod
    userId
    valorFinal
  }
}

Variables:
{
  "items": [
    {
      "productId": 1,
      "quantity": 2
    },
    {
      "productId": 2,
      "quantity": 1
    }
  ],
  "freight": 10,
  "paymentMethod": "boleto"
}
```

#### Checkout (cartão de crédito)
Mutation (envie o token JWT no header Authorization: Bearer <TOKEN_JWT>):
```graphql
mutation {
	checkout(
		items: [{productId: 2, quantity: 1}],
		freight: 15,
		paymentMethod: "credit_card",
		cardData: {
			number: "4111111111111111",
			name: "Nome do Titular",
			expiry: "12/30",
			cvv: "123"
		}
	) {
		valorFinal
		paymentMethod
		freight
		items { productId quantity }
	}
}

Variables:
{
  "items": [
    {
      "productId": 1,
      "quantity": 2
    },
    {
      "productId": 2,
      "quantity": 1
    }
  ],
  "freight": 10,
  "paymentMethod": "credit_card",
  "cardData": {
    "cvv": "123",
    "expiry": "10/04",
    "name": "Julio Costa",
    "number": "1234432112344321"
  }
}
```

#### Consulta de usuários
Query:
```graphql
query Users {
  users {
    email
    name
  }
}
```

## Como rodar

### REST
```bash
node rest/server.js
```
Acesse a documentação Swagger em [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

### GraphQL
```bash
node graphql/app.js
```
Acesse o playground GraphQL em [http://localhost:4000/graphql](http://localhost:4000/graphql)

## Endpoints REST
- POST `/api/users/register` — Registro de usuário
- POST `/api/users/login` — Login (retorna token JWT)
- POST `/api/checkout` — Checkout (requer token JWT)

## Regras de Checkout
- Só pode fazer checkout com token JWT válido
- Informe lista de produtos, quantidades, valor do frete, método de pagamento e dados do cartão se necessário
- 5% de desconto no valor total se pagar com cartão
- Resposta do checkout contém valor final

## Banco de dados
- Usuários e produtos em memória (veja arquivos em `src/models`)

## Testes
- Para testes automatizados, importe o `app` de `rest/app.js` ou `graphql/app.js` sem o método `listen()`

## Documentação
- Swagger disponível em `/api-docs`
- Playground GraphQL disponível em `/graphql`


### k6
```bash
$env:K6_WEB_DASHBOARD = "true"; $env:K6_WEB_DASHBOARD_EXPORT = "dashboard.html"; $env:K6_WEB_DASHBOARD_PERIOD = "2s"; k6 run test/k6/checkout.test.js

```
## checklist funcional
- Thresholds - 95% das requisições devem responder em menos de 2 segundos
```bash
thresholds: {
    'http_req_duration': ['p(95)<2000'] 
  }
```
	
## Checks
- verifica se a api retorna sucesso no registro do usuário com status 201
```bash
check(res, { 'register success (201)': r => r.status === 201 }); 
```
- verifica se a api retorna sucesso no login do usuário com status 200
```bash
check(out.res, { 'login success (200)': r => r.status === 200 });
```
- verifica se a api retorna sucesso no ckechout do usuário com status 200
```bash
check(res, { 'checkout success (200)': r => r.status === 200 });
```

## Helpers
- `auth.js` - contém as informações de login que podem ser acessadas através de suas funções externas
- `getBaseUrl.js` - contém as informações do endpoint utilizado nos testes
- `randomEmail.js` - contem uma função externa geradora de email randomico para que cada usuário possua um email único

## Trends
- métrica adicionada para avaliar o tempo do checkout inteiro e pode ser utilizada para avaliar o valor a ser definido para o percentil p(90) ou p(95) nos thresholds
```bash
export let checkoutDuration = new Trend('checkout_duration'); 
```

## Faker 
- gera um nome de usuário e password únicos para cada teste

```bash
  let password = faker.internet.password();
  let name = faker.person.firstName();
```

## Variável de Ambiente
- variavel de ambiente BASE_URL definida para utilização do endpoint
```bash
__ENV.BASE_URL || 'http://localhost:3000'; 
```
## Stages

## Reaproveitamento de Resposta
- Onde: `auth.js` e `checkout.test.js`
- O que fazemos (resumo): extraímos do body da resposta do POST `/api/users/login` o campo `token` e reutilizamos esse valor no header `Authorization` do POST `/api/checkout`.
- Como está implementado (essencial):
  - Após o login usamos `res.json().token` para obter o JWT:
    - `const token = res.json().token`
  - O helper `loginUser` retorna `{ res, token }` para o chamador.
  - No teste principal atribuímos `token = out.token e enviamos no checkout:
    - `headers: { Authorization: \Bearer ${token}}` 

## Uso de Token de Autenticação
- Onde é obtido: no helper `loginUser` em `auth.js` — após POST `/api/users/login` lemos `res.json().token`.
- Como extraímos: usamos `res.json().token` 
- Como é usado: incluímos no header `Authorization` do request de checkout:
    - `Authorization: 'Bearer ' + token`
- Fluxo no teste: register → login (pega token) → checkout (usa token). O helper retorna `{ res, token }` para o teste usar.
- Validação: fazemos `check(res, {'login status 200': r => r.status === 200})` antes de confiar no token.

## Data-Driven Testing
- aplicamos `check()` nas respostas antes de confiar nos dados 
ex: `check(res, { 'login status 200': r => r.status === 200 })`.

## Groups
- Propósito: organizar o script em blocos lógicos (ex.: registro, login, checkout) para tornar o teste mais legível e o relatório mais compreensível.
- Groups definidos nos testes:
```bash
group('Register user', function () {
    const res = registerUser(name, email, password);
    check(res, { 'register success (201)': r => r.status === 201 });
  });
```
```bash
group('Login user', function () {
    const out = loginUser(email, password);
    check(out.res, { 'login success (200)': r => r.status === 200 });
    token = out.token;
  });
```
```bash
group('Checkout', function () {
    const url = `${base}/api/checkout`;
    // The swagger exposes 'boleto' and 'credit_card' as payment methods.
    // Using 'boleto' as the cash-like option requested.
    const payload = JSON.stringify({
      items: [{ productId: 1, quantity: 1 }],
      freight: 0,
      paymentMethod: 'boleto'
    });
    const params = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token || ''}`
      }
    };
    const t0 = Date.now();
    const res = http.post(url, payload, params);
    const dur = Date.now() - t0;
    checkoutDuration.add(dur);
    check(res, { 'checkout success (200)': r => r.status === 200 });
  });
```
- O que proporciona:
  - Agrupa checks e requests no output do k6, facilitando identificar qual etapa falhou.
  - Permite estrutura hierárquica (nested groups) para separar subtarefas.
  - Facilita depuração e leitura do relatório por fluxo de negócio.


### checklist não funcional
- `avg` - média de tempo de execução
- `min` - tempo de resposta mais rápido obtido na execução
- `max` - tempo de resposta mais lento obtido na execução
- `med` - mediana, organiza os elementos de maneira crescente. 
- `http_reqs` - quantidade de requisições enviadas
- `http_req_failed` - quantidade de requisições com falhas
- `p(90)` - percentil definido para tempo de execução para 90% dos usuários
- `p(95)` - percentil definido para tempo de execução para 95% dos usuários
- `iteration_duration` - duração de cada execução
- `vus` - quantidade de usuários definidos para o teste 
- `vus_maxc` - quantidade de usuários utilizados no teste 
