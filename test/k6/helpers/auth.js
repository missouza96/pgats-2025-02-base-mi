import http from 'k6/http';
import { check } from 'k6';
import { getBaseUrl } from './getBaseUrl.js';

export function registerUser(name, email, password) {
  const url = `${getBaseUrl()}/api/users/register`;
  const payload = JSON.stringify({ name, email, password });
  const params = { headers: { 'Content-Type': 'application/json' } };
  const res = http.post(url, payload, params);
  check(res, { 'register status 201': r => r.status === 201 });
  return res;
}

export function loginUser(email, password) {
  const url = `${getBaseUrl()}/api/users/login`;
  const payload = JSON.stringify({ email, password });
  const params = { headers: { 'Content-Type': 'application/json' } };
  const res = http.post(url, payload, params);
  check(res, { 'login status 200': r => r.status === 200 });
  let token = null;
  try {
    token = res.json().token;
  } catch (e) {}
  return { res, token };
}
