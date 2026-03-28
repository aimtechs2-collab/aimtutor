import { clerkMiddleware } from "@clerk/nextjs/server";

/** Use `proxy.ts` (Node default) instead of Edge `middleware.ts` so Clerk is not analyzed as an Edge bundle. */
export default clerkMiddleware();

export const config = {
  // Apply Clerk to all non-static routes + API routes.
  matcher: ["/((?!.*\\..*).*)", "/", "/(api|trpc)(.*)"],
};
