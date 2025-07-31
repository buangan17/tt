import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/backtest(.*)',
  '/bot(.*)',
  '/profile(.*)'
])

const isPremiumRoute = createRouteMatcher([
  '/dashboard/premium(.*)',
  '/backtest/advanced(.*)',
  '/bot/strategies(.*)'
])

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth()
  
  // Protect routes that require authentication
  if (isProtectedRoute(req)) {
    if (!userId) {
      return Response.redirect(new URL('/sign-in', req.url))
    }
  }
  
  // Protect premium routes
  if (isPremiumRoute(req)) {
    if (!userId) {
      return Response.redirect(new URL('/sign-in', req.url))
    }
    
    const userRole = sessionClaims?.metadata?.role
    if (userRole !== 'premium') {
      return Response.redirect(new URL('/upgrade', req.url))
    }
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}