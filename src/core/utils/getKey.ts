type AcceptedKeys = 'LOGIN_REQUEST' | 'REGISTER_REQUEST' | 'AMPARADO_REQUEST' | 'CONFIG_REQUEST' | 'ENDERECO_REQUEST';

export function getKey(key: AcceptedKeys) {
  return `@app:${key}_request`;
}
