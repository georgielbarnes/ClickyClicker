
import { authGuard, type Env } from '../_lib/auth';

export const onRequestPost: PagesFunction<Env> = authGuard(async ({ req, env }) => {
  const form = await req.formData();
  const file = form.get('file');
  if (!(file instanceof File)) {
    return new Response(JSON.stringify({ ok:false, error:'no file' }), { status:400, headers:{'content-type':'application/json'}});
  }
  const ext = (file.name.split('.').pop() || 'bin').toLowerCase();
  const key = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  await env.BLOG_ASSETS.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type || 'application/octet-stream' }
  });
  const base = env.PUBLIC_CDN_BASE || '/cdn';
  const url = `${base}/${key}`;
  return new Response(JSON.stringify({ ok:true, key, url }), { headers:{'content-type':'application/json'}});
});
