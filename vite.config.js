import { defineConfig } from 'vite';

export default defineConfig(({ command }) =>
  command === 'build'
    ? {
        root: 'html',              // html/index.html é o app real: vira dist/index.html
        base: '/dev-ads-spa/',     // subcaminho do GitHub Pages
        build: {
          outDir: '../dist',        // sai na raiz do repo, fora de html/
          emptyOutDir: true,
        },
      }
    : {
        // dev: serve a raiz do repo, para os caminhos ../css, ../js e ../imagens
        // de html/index.html resolverem. http://localhost:5173/ redireciona para o app.
        root: '.',
      }
);
