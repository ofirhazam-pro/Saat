export async function onRequest(context) {
  const { request, next, env } = context;
  const url = new URL(request.url);

  if (url.pathname.startsWith('/api/')) {
    return next();
  }

  const auth = request.headers.get('Authorization');
  const expectedUser = 'admin';
  const expectedPass = env.PAGES_BASIC_AUTH_PASSWORD || 'change-me-strong-password';

  const valid = auth && auth.startsWith('Basic ') && (() => {
    try {
      const decoded = atob(auth.slice(6));
      const [user, pass] = decoded.split(':');
      return user === expectedUser && pass === expectedPass;
    } catch {
      return false;
    }
  })();

  if (valid) {
    return next();
  }

  return new Response('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="saat"' },
  });
}
