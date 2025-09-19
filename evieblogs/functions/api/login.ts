
import { createToken, setAuthCookie, type Env } from '../_lib/auth';

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const form = await request.formData();
  const user = String(form.get('user') || '');
  const pass = String(form.get('pass') || '');
  if (user === env.ADMIN_USER && pass === env.ADMIN_PASS) {
    const token = await createToken(env, user);
    return new Response(null, {
      status: 302,
      headers: {
        'set-cookie': setAuthCookie(token),
        'location': '/admin/dashboard'
      }
    });
  }
  return new Response(null, { status: 302, headers: { 'location': '/admin?error=bad+credentials' }});
};
