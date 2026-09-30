/* ==========================================================================
   validacao.js — formulário de cadastro
   Regras de validação, feedback visual, rascunho e envio.
   Os listeners são ligados por iniciarFormularioCadastro(), chamada pelo
   roteador depois que a tela de cadastro é desenhada (o #app é recriado
   a cada troca de tela, então os listeners também são recriados).
   ========================================================================== */
import { ler, salvar, remover } from './storage.js';
import { mostrarToast, abrirModal } from './ui.js';

const CAMPOS_RASCUNHO = ['nome', 'email', 'telefone', 'interesse', 'mensagem'];

/* Cada regra recebe o valor do campo e devolve a mensagem de erro ('' = válido). */
const regras = {
  nome: (v) =>
    !v.trim() ? 'Informe seu nome completo.'
    : v.trim().split(/\s+/).length < 2 ? 'Digite nome e sobrenome.'
    : '',

  email: (v) =>
    !v.trim() ? 'Informe seu e-mail.'
    : !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? 'Digite um e-mail válido, como nome@exemplo.com.'
    : '',

  // Opcional: só valida se houver algo digitado
  telefone: (v) =>
    v.trim() && !/^\(\d{2}\)\s?\d{4,5}-?\d{4}$/.test(v.trim())
      ? 'Use o formato (00) 90000-0000.'
      : '',

  interesse: (v) => (v ? '' : 'Escolha uma das opções para continuar.'),

  // Checkbox: recebe true/false
  aceite: (marcado) => (marcado ? '' : 'Marque a caixa para autorizar o contato.'),
};

/** Valida um campo e atualiza aria-invalid, a classe do grupo e a mensagem. */
function validarCampo(campo) {
  const regra = regras[campo.name];
  if (!regra) return true; // campo sem regra (ex.: mensagem)

  const valor = campo.type === 'checkbox' ? campo.checked : campo.value;
  const mensagem = regra(valor);
  const grupo = campo.closest('.form__group');
  const erro = grupo?.querySelector('.form__erro');

  if (mensagem) campo.setAttribute('aria-invalid', 'true');
  else if (valor === '') campo.removeAttribute('aria-invalid'); // opcional vazio: sem selo verde
  else campo.setAttribute('aria-invalid', 'false');

  if (erro) erro.textContent = mensagem;
  grupo?.classList.toggle('is-invalid', Boolean(mensagem));
  return !mensagem;
}

function limparEstados(form) {
  form.querySelectorAll('[aria-invalid]').forEach((c) => c.removeAttribute('aria-invalid'));
  form.querySelectorAll('.is-invalid').forEach((g) => g.classList.remove('is-invalid'));
  form.querySelectorAll('.form__erro').forEach((e) => { e.textContent = ''; });
}

/* ---------------- Rascunho (localStorage) ---------------- */
function salvarRascunho(form) {
  const dados = {};
  CAMPOS_RASCUNHO.forEach((nome) => { dados[nome] = form.elements[nome].value; });
  salvar('rascunho', dados);
}

// Módulo permanece carregado entre as trocas de tela da SPA (só reseta com F5),
// então este flag evita repetir o aviso a cada vez que a pessoa reabre a tela.
let avisoRascunhoMostrado = false;

function restaurarRascunho(form) {
  const rascunho = ler('rascunho');
  if (!rascunho) return;

  let restaurou = false;
  CAMPOS_RASCUNHO.forEach((nome) => {
    if (rascunho[nome]) {
      form.elements[nome].value = rascunho[nome];
      restaurou = true;
    }
  });

  if (restaurou && !avisoRascunhoMostrado) {
    mostrarToast('Recuperamos o que você já tinha preenchido.', 'info', 'Rascunho recuperado');
    avisoRascunhoMostrado = true;
  }
}

/* ---------------- Registro do envio (localStorage) ---------------- */
function registrarCadastro(form) {
  const dados = Object.fromEntries(new FormData(form));
  const lista = ler('cadastros', []);
  lista.push({ ...dados, enviadoEm: new Date().toISOString() });
  salvar('cadastros', lista);
  remover('rascunho');
  avisoRascunhoMostrado = false;
}

/* ---------------- Máscara do telefone (biblioteca IMask) ---------------- */
/**
 * A biblioteca é opcional: se o script não carregar, window.IMask não existe
 * e o formulário continua funcionando (só sem a máscara).
 * Máscara dinâmica: fixo (10 dígitos) ou celular (11 dígitos).
 */
function aplicarMascaraTelefone(form) {
  if (!window.IMask) return null;
  return window.IMask(form.elements.telefone, {
    mask: [{ mask: '(00) 0000-0000' }, { mask: '(00) 00000-0000' }],
    dispatch: (novo, mascara) => {
      const digitos = (mascara.value + novo).replace(/\D/g, '');
      return mascara.compiledMasks[digitos.length > 10 ? 1 : 0];
    },
  });
}

/* ---------------- Ligação dos eventos ---------------- */
export function iniciarFormularioCadastro() {
  const form = document.querySelector('[data-form-cadastro]');
  if (!form) return;

  const tocados = new Set(); // campos que a pessoa já visitou
  let temporizador;

  restaurarRascunho(form);
  // Depois de restaurar: a máscara lê o valor que já estiver no campo e o formata
  const mascaraTelefone = aplicarMascaraTelefone(form);

  // Delegação dentro do formulário: um listener atende todos os campos.
  // "focusout" (e não "blur") porque focusout sobe pela árvore do DOM.
  form.addEventListener('focusout', (e) => {
    const campo = e.target;
    if (!campo.name) return;
    tocados.add(campo.name);
    validarCampo(campo);
  });

  form.addEventListener('input', (e) => {
    const campo = e.target;
    const ehEscolha = campo.type === 'checkbox' || campo.tagName === 'SELECT';

    // Enquanto a pessoa digita, só revalida quem já foi visitado; escolhas validam na hora
    if (tocados.has(campo.name) || ehEscolha) {
      tocados.add(campo.name);
      validarCampo(campo);
    }

    // Rascunho com atraso de 300ms para não gravar a cada tecla
    clearTimeout(temporizador);
    temporizador = setTimeout(() => salvarRascunho(form), 300);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault(); // a SPA controla o envio; a página não recarrega

    const campos = [...form.elements].filter((c) => c.name);
    campos.forEach(validarCampo); // valida todos, sem parar no primeiro erro
    const invalido = campos.find((c) => c.getAttribute('aria-invalid') === 'true');

    if (invalido) {
      invalido.focus();
      mostrarToast('Revise os campos destacados e tente de novo.', 'erro', 'Cadastro não enviado');
      return;
    }

    registrarCadastro(form);
    form.reset();
    if (!abrirModal('modal-sucesso')) {
      mostrarToast('Recebemos seus dados e vamos entrar em contato.', 'sucesso', 'Cadastro enviado');
    }
  });

  form.addEventListener('reset', () => {
    clearTimeout(temporizador);
    remover('rascunho');
    avisoRascunhoMostrado = false;
    tocados.clear();
    // O reset dispara antes de os valores voltarem ao padrão: limpa no próximo ciclo
    setTimeout(() => {
      mascaraTelefone?.updateValue(); // a máscara guarda estado próprio: ressincroniza com o campo vazio
      limparEstados(form);
    }, 0);
  });
}
