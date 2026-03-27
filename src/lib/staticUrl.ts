export function getStaticUploadBase() {
  return (
    process.env.NEXT_PUBLIC_STATIC_URL ??
    "https://aifa-cloud.onrender.com/static/uploads/"
  );
}

export function thumbnailUrl(path: string | null | undefined) {
  if (!path) return null;
  const cleanPath = path.replace(/\\/g, "/").replace(/^\/+/, "");
  return `${getStaticUploadBase()}${cleanPath}`;
}
