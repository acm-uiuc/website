import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  // Handle SPA routes for /store/* in development
  if (
    context.url.pathname.startsWith('/store/') &&
    !context.url.pathname.includes('.')
  ) {
    // Rewrite to /store (let client-side router handle it)
    return context.rewrite('/store');
  }

  return next();
});
