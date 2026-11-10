import createMDX from "@next/mdx";

const withMDX = createMDX({});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  pageExtensions: ["js", "jsx", "mdx"],
  turbopack: { root: import.meta.dirname },
};

export default withMDX(nextConfig);
