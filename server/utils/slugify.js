// Turns a business name into a URL-safe slug, e.g. "Tobi's Perfume Shop" -> "tobis-perfume-shop"
export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // strip anything not a letter/number/space/hyphen
    .replace(/\s+/g, "-") // spaces -> hyphens
    .replace(/-+/g, "-"); // collapse multiple hyphens
};
