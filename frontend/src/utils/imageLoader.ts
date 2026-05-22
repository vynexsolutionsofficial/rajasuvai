// import.meta.glob with { eager: true } returns module objects.
// For image files, the default export is the resolved asset URL string.
// This works in Vite 5, 6, 7, 8 — no deprecated `as: 'url'` or `query` needed.
const modules = import.meta.glob('../assets/**/*.{jpg,jpeg,png,svg,gif}', {
  eager: true
}) as Record<string, { default: string }>;

// Pre-build a flat map of lowercase key → URL for fast lookup
const imageMap: Record<string, string> = {};
for (const [key, mod] of Object.entries(modules)) {
  if (mod?.default) {
    imageMap[key.toLowerCase()] = mod.default;
  }
}

export const getProductCoverImage = (folderName: string | undefined): string => {
  if (!folderName) return '';

  if (folderName.startsWith('http://') || folderName.startsWith('https://')) {
    return folderName;
  }

  const folder = folderName.toLowerCase();

  // Prefer the image that contains '01' (main cover shot)
  const coverKey = Object.keys(imageMap).find(
    k => k.includes(`/${folder}/`) && k.includes('01')
  );
  if (coverKey) return imageMap[coverKey];

  // Fall back to any image in that folder
  const anyKey = Object.keys(imageMap).find(k => k.includes(`/${folder}/`));
  return anyKey ? imageMap[anyKey] : '';
};

export const getProductAllImages = (folderName: string | undefined): string[] => {
  if (!folderName) return [];

  if (folderName.startsWith('http://') || folderName.startsWith('https://')) {
    return [folderName];
  }

  const folder = folderName.toLowerCase();

  return Object.keys(imageMap)
    .filter(k => k.includes(`/${folder}/`))
    .sort()
    .map(k => imageMap[k]);
};
