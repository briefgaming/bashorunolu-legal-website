/** @type {import('next').NextConfig} */
module.exports = {
  experimental: {
    // sharp loads its platform-specific binary dynamically, which Next cannot detect,
    // so ship it with the share-image route. (Next 13.5 applies this to pages/ routes only.)
    outputFileTracingIncludes: {
      '/api/og/[slug]': [
        './node_modules/sharp/**/*',
        './node_modules/@img/sharp-darwin-arm64/**/*',
        './node_modules/@img/sharp-libvips-darwin-arm64/**/*',
        './node_modules/@img/sharp-linux-x64/**/*',
        './node_modules/@img/sharp-libvips-linux-x64/**/*',
      ],
    },
  },
};
