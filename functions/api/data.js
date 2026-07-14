export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  const key = url.searchParams.get('key') || 'saat.json';
  const kv = env.SAAT_KV;

  if (!kv) {
    return new Response(JSON.stringify({ ok: false, error: 'SAAT_KV binding not configured' }), {
      status: 500,
      headers: { 'content-type': 'application/json' }
    });
  }

  if (request.method === 'PUT') {
    try {
      const body = await request.json();
      const payload = body?.payload;
      if (!payload || !payload.pledges || !payload.donations) {
        return new Response(JSON.stringify({ ok: false, error: 'invalid payload' }), {
          status: 400,
          headers: { 'content-type': 'application/json' }
        });
      }

      await kv.put(key, JSON.stringify(payload), { metadata: { updatedAt: Date.now() } });
      return new Response(JSON.stringify({ ok: true, key }), {
        headers: { 'content-type': 'application/json' }
      });
    } catch (err) {
      return new Response(JSON.stringify({ ok: false, error: err.message }), {
        status: 500,
        headers: { 'content-type': 'application/json' }
      });
    }
  }

  if (request.method === 'GET') {
    try {
      const value = await kv.get(key, 'json');
      if (!value) {
        return new Response(JSON.stringify({ ok: false, error: 'not found' }), {
          status: 404,
          headers: { 'content-type': 'application/json' }
        });
      }
      return new Response(JSON.stringify({ ok: true, payload: value }), {
        headers: { 'content-type': 'application/json' }
      });
    } catch (err) {
      return new Response(JSON.stringify({ ok: false, error: err.message }), {
        status: 500,
        headers: { 'content-type': 'application/json' }
      });
    }
  }

  return new Response(JSON.stringify({ ok: false, error: 'method not allowed' }), {
    status: 405,
    headers: { 'content-type': 'application/json' }
  });
}
