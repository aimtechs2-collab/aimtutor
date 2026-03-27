// src/utils/seoSlug.js

/**
 * Convert any string to URL-friendly slug
 * Example: "Cloud Computing" → "cloud-computing"
 */
export const slugify = (s) =>
  (s ?? "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-") // Remove special chars, keep letters/numbers
    .replace(/^-+|-+$/g, "");          // Remove leading/trailing hyphens

/**
 * Build SEO-friendly category URL
 * Example: buildCategoryCitySeo("Cloud Computing", "Hyderabad")
 * Returns: "cloud-computing-training-in-hyderabad"
 */
export const buildCategoryCitySeo = (categoryName, city) => {
  const cat = slugify(categoryName);
  const cty = slugify(city || "hyderabad");
  return `${cat}-training-in-${cty}`;
};

/**
 * ✅ NEW: Build SEO-friendly subcategory URL
 * Example: buildSubcategoryCitySeo("AWS DevOps", "Hyderabad")
 * Returns: "aws-devops-training-in-hyderabad"
 */
export const buildSubcategoryCitySeo = (subcategoryName, city) => {
  const sub = slugify(subcategoryName);
  const cty = slugify(city || "hyderabad");
  return `${sub}-training-in-${cty}`;
};


/**
 * ✅ NEW: Build SEO-friendly course URL
 * Example: buildCourseCitySeo("AWS Solutions Architect Associate", "Hyderabad")
 * Returns: "aws-solutions-architect-associate-training-in-hyderabad"
 */
export const buildCourseCitySeo = (courseTitle, city) => {
  const course = slugify(courseTitle);
  const cty = slugify(city || "hyderabad");
  return `${course}-course-in-${cty}`;
};

/**
 * ✅ NEW: Parse category SEO slug to extract parts
 * Example: "cloud-computing-training-in-hyderabad"
 * Returns: { name: "cloud-computing", city: "hyderabad" }
 */
export const parseSeoSlug = (seoSlug) => {
  const match = (seoSlug || "").match(/^(.*)-training-in-(.*)$/i);
  if (!match) return null; // Invalid format
  return {
    name: slugify(match[1]),
    city: slugify(match[2])
  };
};