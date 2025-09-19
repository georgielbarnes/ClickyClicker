
# Friendly Astro Blog (SSR on Cloudflare Pages)

A pretty, friendly writing blog powered by **Astro (server-side rendering)** and **Cloudflare Pages**.  
It includes a secure admin area with httpOnly cookie auth, file uploads to **R2**, and posts stored in **KV**.

## Features
- 🌟 Friendly, cozy theme
- 📝 Markdown posts with sanitization
- 🔒 Admin login (JWT in httpOnly cookie) + protected APIs
- 🗃️ Posts in KV (`BLOG_KV`), file uploads to R2 (`BLOG_ASSETS`)
- ⚡ Server-rendered (SSR) on Cloudflare Pages

## Quick start
1. **Install**  
   ```bash
   npm i
   ```
2. **Local dev**  
   Astro SSR dev server:
   ```bash
   npm run dev
   ```
   > Pages Functions run on Cloudflare; the code is compatible for deployment. For end-to-end testing with Cloudflare’s runtime, deploy to a Pages preview.
3. **Build**  
   ```bash
   npm run build
   ```

## Cloudflare setup
1. Create a **Pages** project and connect this repository.
2. Enable **Functions** in Pages settings.
3. Add **KV** namespace and bind as `BLOG_KV`.
4. Create an **R2** bucket and bind as `BLOG_ASSETS`.
5. Add environment variables:
   - `JWT_SECRET` — long random string
   - `ADMIN_USER` — your email
   - `ADMIN_PASS` — strong password
   - `PUBLIC_CDN_BASE` — `/cdn`
6. Deploy. Visit `/admin` to log in, upload a cover image, and publish your first post.

## Security notes
- Admin APIs require the auth cookie on every call.
- Consider adding **Cloudflare Access** for SSO on `/admin/*` as an additional layer.

## License
MIT
