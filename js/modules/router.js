/* ==========================================================================
   router.js — roteador da SPA por hash (#/projetos, #/projetos/educacao)
   Fluxo: hashchange → lerRota() → template da rota → innerHTML no #app
          → título, link ativo, foco e aoCarregar().
   ========================================================================== */
import { rotas } from './templates.js';

/** Quebra o hash em { chave: '/projetos', param: 'educacao', hash: '/projetos/educacao' }. */
function lerRota() {
  const bruto = location.hash.slice(1);
  const hash = bruto.startsWith('/') ? bruto : '/'; // sem hash (ou hash solto) = início
  const [, base = '', param] = hash.split('/');
  return { chave: `/${base}`, param, hash };
}

/** Marca com aria-current="page" os links que apontam para a rota atual. */
function marcarLinkAtivo(hash, chave) {
  document.querySelectorAll('.nav__link').forEach((link) => {
    const destino = link.getAttribute('href');
    if (destino === `#${hash}` || destino === `#${chave}`) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

export function renderizar() {
  const app = document.getElementById('app');
  const { chave, param, hash } = lerRota();
  const rota = rotas[chave] ?? rotas['/404'];

  app.innerHTML = rota.template(param);
  document.title = `${rota.titulo} — Instituto Vida Nova`;
  marcarLinkAtivo(hash, chave);
  window.scrollTo(0, 0);
  app.focus({ preventScroll: true }); // leitores de tela percebem a troca de tela
  rota.aoCarregar?.();                // liga os eventos específicos da tela
}

export function iniciarRoteador() {
  window.addEventListener('hashchange', renderizar);
  renderizar(); // primeira abertura ou F5: desenha a rota atual
}
