/**
 * Resolves course/media paths stored in the DB (relative paths or legacy full URLs)
 * to URLs that load from this deployment.
 *
 * Do NOT set NEXT_PUBLIC_STATIC_URL to the old aifa-cloud host — it will be ignored.
 * Use a real CDN/origin base (no trailing slash), or leave unset for same-origin `/uploads/...`.
 *
 * Optional: NEXT_PUBLIC_LEGACY_UPLOAD_HOSTS=comma,separated,hostnames to rewrite more old CDNs.
 */

const DEFAULT_LEGACY_HOSTS = [
  "aifa-cloud.onrender.com",
  "www.aifa-cloud.onrender.com",
];

function extraLegacyHosts(): string[] {
  return (process.env.NEXT_PUBLIC_LEGACY_UPLOAD_HOSTS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

function isLegacyHost(hostname: string): boolean {
  const h = hostname.toLowerCase();
  if (DEFAULT_LEGACY_HOSTS.includes(h)) return true;
  return extraLegacyHosts().includes(h);
}

/** If NEXT_PUBLIC_STATIC_URL points at a legacy CDN, treat as unset (same-origin paths). */
export function getStaticUploadBase(): string {
  const raw = (process.env.NEXT_PUBLIC_STATIC_URL ?? "").trim();
  if (!raw) return "";
  const base = raw.replace(/\/+$/, "");
  try {
    const url = base.includes("://") ? new URL(base) : new URL(`https://${base}`);
    if (isLegacyHost(url.hostname)) return "";
  } catch {
    return base;
  }
  return base;
}

/** Legacy DB rows sometimes used `/static/uploads/...` or doubled `uploads/`. */
export function normalizeUploadPath(path: string): string {
  let p = path.replace(/\\/g, "/").trim();
  if (!p) return "";

  if (p.startsWith("//")) {
    p = `https:${p}`;
  }

  if (/^https?:\/\//i.test(p)) {
    try {
      const u = new URL(p);
      if (!isLegacyHost(u.hostname)) {
        return p;
      }
      p = u.pathname || "";
    } catch {
      return path.replace(/^\/+/, "");
    }
  }

  p = p.replace(/^\/+/, "");
  if (p.startsWith("static/uploads/")) {
    p = p.slice("static/".length);
  }
  p = p.replace(/^uploads\/uploads\//, "uploads/");
  return p;
}

/**
 * Thumbnail / upload image URL for `<img src>`.
 * - Relative paths → `/uploads/...` on this site (or under `NEXT_PUBLIC_STATIC_URL`).
 * - Legacy CDN hosts → same path on this site.
 * - Other absolute URLs → left unchanged.
 */
export function thumbnailUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  let raw = path.trim();
  if (!raw) return null;

  if (raw.startsWith("//")) {
    raw = `https:${raw}`;
  }

  if (/^https?:\/\//i.test(raw)) {
    try {
      const u = new URL(raw);
      if (!isLegacyHost(u.hostname)) {
        return raw;
      }
      const cleanPath = normalizeUploadPath(u.pathname || "");
      if (!cleanPath) return null;
      const base = getStaticUploadBase();
      if (!base) return `/${cleanPath}`;
      return `${base}/${cleanPath}`;
    } catch {
      return null;
    }
  }

  const cleanPath = normalizeUploadPath(raw);
  if (!cleanPath) return null;
  const base = getStaticUploadBase();
  if (!base) return `/${cleanPath}`;
  return `${base}/${cleanPath}`;
}
