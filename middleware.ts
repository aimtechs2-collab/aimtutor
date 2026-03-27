import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  // Apply Clerk middleware to all non-static routes + API routes.
  matcher: ["/((?!.*\\..*).*)", "/", "/(api|trpc)(.*)"],
};

