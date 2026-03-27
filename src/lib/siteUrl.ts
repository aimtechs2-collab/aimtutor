const DEFAULT_SITE_ORIGIN = "https://aimtutor.co";

export function getSiteOrigin() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_ORIGIN).replace(/\/$/, "");
}

export function toAbsoluteUrl(pathname: string) {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${getSiteOrigin()}${normalizedPath}`;
}

