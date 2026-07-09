import slugify from 'slugify';

export const generateSlug = (text) =>
  slugify(text, { lower: true, strict: true, trim: true });

// Appends a short random suffix to guarantee uniqueness when needed
export const generateUniqueSlug = (text) => {
  const base = generateSlug(text);
  const suffix = Math.random().toString(36).slice(2, 7);
  return `${base}-${suffix}`;
};
