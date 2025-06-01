import { defineConfig } from 'vite';
import stringPlugin from 'vite-plugin-string';

export default defineConfig({
  plugins: [
    stringPlugin({
      include: ['**/*.glsl', '**/*.vert', '**/*.frag']
    })
  ]
});
