// Reads the one-time token from a URL fragment like "#token=<43 url-safe chars>".
export function readMagicToken(hash) {
    const match = /^#token=([A-Za-z0-9_-]{43})$/.exec(hash || '');
    return match ? match[1] : '';
}
