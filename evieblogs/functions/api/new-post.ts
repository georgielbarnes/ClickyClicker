
import { authGuard, type Env } from '../_lib/auth';

export const onRequestPost: PagesFunction<Env> = authGuard(async ({ req, env }) => {
  const body = await req.json().catch(()=>null) as any;
  if (!body?.title || !body?.content) {
    return new Response(JSON.stringify({ ok:false, error:'title and content required' }), { status:400, headers:{'content-type':'application/json'}});
  }
  const slug = (body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')).slice(0,80);
  const post = {
    slug,
    title: String(body.title),
    excerpt: String(body.excerpt || '').slice(0,180),
    content: String(body.content),
    coverImage: body.coverImage ? String(body.coverImage) : '',
    tags: Array.isArray(body.tags) ? body.tags : [],
    publishedAt: new Date().toISOString()
  };

  await env.BLOG_KV.put(`post:${slug}`, JSON.stringify(post));

  const listKey = 'posts:index';
  const index = (await env.BLOG_KV.get(listKey, 'json')) as any[] || [];
  const filtered = index.filter((p:any)=>p.slug !== slug);
  filtered.unshift({ slug, title: post.title, excerpt: post.excerpt, coverImage: post.coverImage, publishedAt: post.publishedAt });
  await env.BLOG_KV.put(listKey, JSON.stringify(filtered.slice(0, 500)));

  return new Response(JSON.stringify({ ok:true, slug }), { headers: { 'content-type':'application/json' }});
});
