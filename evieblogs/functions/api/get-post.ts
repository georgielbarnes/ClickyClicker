
import type { Env } from '../_lib/auth';

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const slug = url.searchParams.get('slug');
  if (!slug) return new Response(JSON.stringify({ ok:false, error:'missing slug' }), { status:400 });
  const post = await env.BLOG_KV.get(`post:${slug}`, 'json');
  if (!post) return new Response(JSON.stringify({ ok:false, error:'not found' }), { status:404 });
  return new Response(JSON.stringify({ ok:true, post }), { headers: { 'content-type':'application/json' }});
};
