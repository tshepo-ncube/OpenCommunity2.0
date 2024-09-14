/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   async rewrites() {
//     return [
//       {
//         source: "/oauth2/v2.0/token", // Only the path pattern
//         destination:
//           "https://login.microsoftonline.com/bd82620c-6975-47c3-9533-ab6b5493ada3/oauth2/v2.0/token",
//       },
//     ];
//   },
// };

// export default nextConfig;

// next.config.js
// module.exports = {
//     async rewrites() {
//         return [
//           {
//             source: '/api/:path*',
//             destination: 'https://api.example.com/:path*',
//           },
//         ]
//       },
//   };
