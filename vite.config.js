import { defineConfig } from 'vite';

export default defineConfig({
  root: 'html',              // html/index.html é o app real
  base: '/dev-ads-spa/',     // subcaminho do GitHub Pages
  build: {
    outDir: '../dist',        // sai na raiz do repo, fora de html/
    emptyOutDir: true,
  },
  server: {
    fs: {
      allow: ['..'],          // permite servir css/, js/, imagens/ (um nível acima de html/)
    },
  },
});
