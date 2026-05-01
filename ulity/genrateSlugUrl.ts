export function makeSlugUrl(text: string, randomLength: number = 5): string {
  if (!text) return "";

  // Clean + format text
  const formatted = text
    .trim()
    .replace(/\s+/g, "-") // spaces → hyphen
    .replace(/[^a-zA-Z0-9-]/g, "") // remove special chars
    .replace(/-+/g, "-"); // remove duplicate hyphens

  // Generate random numbers
  const randomNumbers = Array.from({ length: randomLength }, () =>
    Math.floor(Math.random() * 10),
  ).join("");

  return `${formatted}${randomNumbers}`;
}
