/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Product media comes from Supabase storage + external CDNs.
    // Kept permissive so <Image> works if adopted later; plain <img> also fine.
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'cdn-icons-png.flaticon.com' },
    ],
  },
};

export default nextConfig;
