export const slugify = (s: string | null | undefined) =>
  (s ?? "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");

export const buildCategoryCitySeo = (categoryName: string, city: string) => {
  const cat = slugify(categoryName);
  const cty = slugify(city || "hyderabad");
  return `${cat}-training-in-${cty}`;
};

export const buildSubcategoryCitySeo = (subcategoryName: string, city: string) => {
  const sub = slugify(subcategoryName);
  const cty = slugify(city || "hyderabad");
  return `${sub}-training-in-${cty}`;
};

export const buildCourseCitySeo = (courseTitle: string, city: string) => {
  const course = slugify(courseTitle);
  const cty = slugify(city || "hyderabad");
  return `${course}-course-in-${cty}`;
};

export const parseSeoSlug = (seoSlug: string) => {
  const match = (seoSlug || "").match(/^(.*)-training-in-(.*)$/i);
  if (!match) return null;
  return {
    name: slugify(match[1]),
    city: slugify(match[2]),
  };
};

export const parseCourseCitySeo = (seoSlug: string) => {
  const match = (seoSlug || "").match(/^(.*)-course-in-(.*)$/i);
  if (!match) return null;
  return {
    name: slugify(match[1]),
    city: slugify(match[2]),
  };
};
