
import { clearAuthCookie, type Env } from '../_lib/auth';

export const onRequestPost: PagesFunction<Env> = async () => {
  return new Response(null, { status: 302, headers: { 'set-cookie': clearAuthCookie(), 'location': '/admin' }});
};
