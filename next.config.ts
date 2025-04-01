import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
});

export default withPWA({
  // Your Next.js config
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "towknfnalefxuyzqwxsw.supabase.co",
      },
    ],
  },
});
