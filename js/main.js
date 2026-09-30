/* ==========================================================================
   main.js — ponto de entrada da SPA
   Só importa os módulos e os inicia. Nenhum módulo importa este arquivo.
   Scripts type="module" são adiados até o HTML terminar de carregar.
   ========================================================================== */
import { iniciarRoteador } from './modules/router.js';
import { iniciarMenu, iniciarUI } from './modules/ui.js';

iniciarMenu();     // hambúrguer (elementos estáticos do cabeçalho)
iniciarUI();       // modal e link "Ir para o conteúdo" (delegação no document)
iniciarRoteador(); // desenha a tela da rota atual e escuta o hashchange
