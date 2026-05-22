// Vite 5+ syntax: use query + import instead of the removed `as: 'url'` option
const images = import.meta.glob('../assets/**/*.{jpg,jpeg,png,svg,gif}', {
  eager: true,
  query: '?url',
  import: 'default'
}) as Record<string, string>;

export const getProductCoverImage = (folderName: string | undefined): string => {
  if (!folderName) return '/products/turmeric.png';

  const folderLower = folderName.toLowerCase();

  // Try to find the image containing '01' (cover photo)
  let coverKey = Object.keys(images).find(key =>
    key.toLowerCase().includes(`/${folderLower}/`) && key.toLowerCase().includes('01')
  );

  // If no '01' image, fallback to the first image found in that folder
  if (!coverKey) {
    coverKey = Object.keys(images).find(key =>
      key.toLowerCase().includes(`/${folderLower}/`)
    );
  }

  return coverKey ? images[coverKey] : '/products/turmeric.png';
};

export const getProductAllImages = (folderName: string | undefined): string[] => {
  if (!folderName) return [];

  const folderLower = folderName.toLowerCase();

  const found = Object.keys(images)
    .filter(key => key.toLowerCase().includes(`/${folderLower}/`))
    .sort()
    .map(key => images[key]);

  return found.length > 0 ? found : [];
};
