/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}
const withTM = require('next-transpile-modules')(["flowbite-react"]); 

module.exports = withTM();
module.exports = nextConfig
