/* ==========================================================================
   ui.js — componentes de interface reutilizáveis
   Menu hambúrguer, modal (<dialog> nativo) e toast.
   Nada aqui acessa o DOM no momento do import: tudo roda dentro de funções.
   ========================================================================== */

/* ------------------------------------------------------------------
   MENU HAMBÚRGUER (elementos estáticos do index.html)
   ------------------------------------------------------------------ */
export function iniciarMenu() {
  const toggle = document.querySelector('.nav__toggle');
  const lista = document.querySelector('.nav__list');
  if (!toggle || !lista) return;

  const definirMenu = (aberto) => {
    lista.classList.toggle('is-open', aberto);
    toggle.setAttribute('aria-expanded', String(aberto));
    toggle.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
  };

  toggle.addEventListener('click', () => {
    definirMenu(!lista.classList.contains('is-open'));
  });

  // Delegação: um único listener na lista cobre todos os links
  lista.addEventListener('click', (e) => {
    if (e.target.closest('a')) definirMenu(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lista.classList.contains('is-open')) {
      definirMenu(false);
      toggle.focus();
    }
  });

  // Ao chegar no layout de desktop (768px), reinicia o estado do menu
  window.matchMedia('(min-width: 768px)').addEventListener('change', (e) => {
    if (e.matches) definirMenu(false);
  });
}

/* ------------------------------------------------------------------
   MODAL
   Abrir:  <button data-modal-abrir="id-do-dialog">  ou  abrirModal('id')
   Fechar: <button data-modal-fechar>, tecla Esc (nativa) ou clique no fundo
   ------------------------------------------------------------------ */
export function abrirModal(id) {
  const modal = document.getElementById(id);
  if (modal && typeof modal.showModal === 'function') {
    modal.showModal();
    return true;
  }
  return false;
}

/* ------------------------------------------------------------------
   TOAST
   mostrarToast('Mensagem', 'sucesso' | 'erro' | 'aviso' | 'info', 'Título opcional')
   ------------------------------------------------------------------ */
function obterAreaToast() {
  let area = document.getElementById('toast-area');
  if (!area) {
    area = document.createElement('div');
    area.id = 'toast-area';
    area.className = 'toast-area';
    area.setAttribute('aria-live', 'polite');
    document.body.appendChild(area);
  }
  return area;
}

export function mostrarToast(mensagem, tipo = 'info', titulo = '') {
  const tiposValidos = ['sucesso', 'erro', 'aviso', 'info'];
  const variante = tiposValidos.includes(tipo) ? tipo : 'info';

  const toast = document.createElement('div');
  toast.className = `toast alert alert--${variante}`;
  toast.setAttribute('role', variante === 'erro' ? 'alert' : 'status');

  const conteudo = document.createElement('div');
  conteudo.className = 'alert__conteudo';

  if (titulo) {
    const t = document.createElement('strong');
    t.className = 'alert__titulo';
    t.textContent = titulo;
    conteudo.appendChild(t);
  }

  const texto = document.createElement('p');
  texto.className = 'alert__texto';
  texto.textContent = mensagem; // textContent: o texto nunca é interpretado como HTML
  conteudo.appendChild(texto);

  const fechar = document.createElement('button');
  fechar.type = 'button';
  fechar.className = 'alert__fechar';
  fechar.setAttribute('aria-label', 'Fechar notificação');
  fechar.textContent = '×';

  toast.append(conteudo, fechar);
  obterAreaToast().appendChild(toast);

  const remover = () => {
    if (!toast.isConnected) return;
    toast.classList.add('is-saindo');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
    setTimeout(() => toast.remove(), 400); // garantia se as animações estiverem desligadas
  };

  fechar.addEventListener('click', remover);
  setTimeout(remover, 5000);
}

/* ------------------------------------------------------------------
   EVENTOS GLOBAIS (delegação no document)
   Valem para elementos que existem agora e para os criados depois.
   ------------------------------------------------------------------ */
export function iniciarUI() {
  document.addEventListener('click', (e) => {
    const abrir = e.target.closest('[data-modal-abrir]');
    if (abrir) {
      abrirModal(abrir.getAttribute('data-modal-abrir'));
      return;
    }

    const fechar = e.target.closest('[data-modal-fechar]');
    if (fechar) {
      fechar.closest('dialog')?.close();
      return;
    }

    // Clique no fundo escurecido: o alvo é o próprio <dialog>
    if (e.target.tagName === 'DIALOG' && e.target.classList.contains('modal')) {
      e.target.close();
    }
  });

  // O link "Ir para o conteúdo" usaria #hash e confundiria o roteador:
  // interceptamos o clique e movemos o foco direto para o #app.
  document.querySelector('.skip-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('app')?.focus();
  });
}
