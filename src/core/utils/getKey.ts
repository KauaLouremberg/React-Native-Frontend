type AcceptedKeys = 'LOGIN_REQUEST' | 'REGISTER_REQUEST';

export function getKey(key: AcceptedKeys) {
  return `@app:${key}_request`;
}
