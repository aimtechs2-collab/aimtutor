import axios from "axios";

/** Browser: same-origin `/api/v1/*` (Next rewrites). Server/SSR: talk to admin backend directly. */
function getBaseURL() {
  // In browser, force root-relative API calls (avoid /student/api/... resolution).
  if (typeof window !== "undefined") return "/";
  return process.env.NEXT_PUBLIC_ADMIN_BACKEND_URL ?? "http://localhost:3001";
}

export const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  // Avoid Node proxy auto-detection path that triggers DEP0169 via `url.parse()`.
  // We call a known internal backend URL directly, so explicit no-proxy is safer.
  proxy: false,
});

api.interceptors.request.use(async (config) => {
  if (typeof window === "undefined") return config;

  // In client components, fetch token from the loaded Clerk JS instance.
  // `@clerk/nextjs` server helpers don't provide a browser session token here.
  type ClerkLike = {
    loaded?: boolean;
    session?: { getToken: (opts?: { template?: string }) => Promise<string | null> };
    user?: {
      primaryEmailAddress?: { emailAddress?: string | null };
      emailAddresses?: Array<{ emailAddress?: string | null }>;
      firstName?: string | null;
      lastName?: string | null;
    };
  };
  const clerk = (window as unknown as { Clerk?: ClerkLike }).Clerk;

  let token: string | null = null;
  if (clerk?.session?.getToken) {
    if (!clerk.loaded) {
      for (let i = 0; i < 10 && !clerk.loaded; i += 1) {
        await new Promise((r) => setTimeout(r, 50));
      }
    }
    token = await clerk.session.getToken();
  }

  if (token && token.length > 0) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  const clerkUser = clerk?.user;
  const email =
    clerkUser?.primaryEmailAddress?.emailAddress ??
    clerkUser?.emailAddresses?.[0]?.emailAddress ??
    null;
  if (email) {
    config.headers = config.headers ?? {};
    config.headers["x-clerk-email"] = email;
    config.headers["x-clerk-first-name"] = clerkUser?.firstName ?? "";
    config.headers["x-clerk-last-name"] = clerkUser?.lastName ?? "";
  }
  return config;
});
