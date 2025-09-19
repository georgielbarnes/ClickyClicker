
import type { Env } from '../_lib/auth';

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const listKey = 'posts:index';
  const index = (await env.BLOG_KV.get(listKey, 'json')) as any[] | null;
  // Public endpoint to read posts; OK to be unauthenticated
  return new Response(JSON.stringify({ ok: true, posts: index ?? [] }), { headers: { 'content-type':'application/json' }});
};
