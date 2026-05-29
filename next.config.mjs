import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  sassOptions: {
    includePaths: [path.join(__dirname)],
    prependData: `@use "@/app/styles/breakpoints.scss" as *;`,
    silenceDeprecations: ['legacy-js-api', 'import']
  },
};

export default nextConfig;