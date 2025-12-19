export function randomEmail() {
  const id = Math.random().toString(36).substring(2, 10);
  return `loadtest+${id}@example.com`;
}
