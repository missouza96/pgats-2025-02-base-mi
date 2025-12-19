import { group, check, sleep } from 'k6';
import http from 'k6/http';
import { Trend } from 'k6/metrics';
import { randomEmail } from './helpers/randomEmail.js';
import { getBaseUrl } from './helpers/getBaseUrl.js';
import { registerUser, loginUser } from './helpers/auth.js';
import faker from "k6/x/faker";


export let checkoutDuration = new Trend('checkout_duration');

export let options = {
  vus: 10,
  duration: '30s',
  thresholds: {
    'http_req_duration': ['p(95)<2000']
  },
};


export default function () {
  const base = getBaseUrl();
  const email = randomEmail();
  let password = faker.internet.password();
  let name = faker.person.firstName();

  group('Register user', function () {
    const res = registerUser(name, email, password);
    check(res, { 'register success (201)': r => r.status === 201 });

  });

  let token = null;
  group('Login user', function () {
    const out = loginUser(email, password);
    check(out.res, { 'login success (200)': r => r.status === 200 });
    token = out.token;
  });

  group('Checkout', function () {
    const url = `${base}/api/checkout`;

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


  sleep(1);
}
