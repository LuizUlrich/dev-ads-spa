/* ==========================================================================
   templates.js — dados, componentes (funções que devolvem HTML) e telas
   Regra de ouro: todo texto que vem dos dados passa por esc() antes de
   entrar em um template, porque innerHTML interpreta HTML.
   ========================================================================== */
import { iniciarFormularioCadastro } from './validacao.js';

/* ---------------- Dados de origem ---------------- */
export const projetos = [
  {
    id: 'reforco', titulo: 'Reforço Escolar', categoria: 'Educação', slug: 'educacao',
    status: 'Em andamento',
    descricao: 'Aulas de português e matemática para crianças do ensino fundamental, duas vezes por semana, com voluntários e material fornecido pelo instituto.',
  },
  {
    id: 'digital', titulo: 'Capacitação Digital', categoria: 'Educação', slug: 'educacao',
    status: 'Vagas limitadas',
    descricao: 'Oficinas de informática básica, e-mail e currículo online para jovens e adultos que buscam o primeiro emprego ou uma recolocação.',
  },
  {
    id: 'saude', titulo: 'Saúde na Praça', categoria: 'Saúde', slug: 'saude',
    status: 'Vagas limitadas',
    descricao: 'Aferição de pressão, orientação nutricional e encaminhamento para a rede pública de saúde, aos sábados de manhã.',
  },
  {
    id: 'esporte', titulo: 'Esporte para Todos', categoria: 'Saúde', slug: 'saude',
    status: 'Em andamento',
    descricao: 'Atividades físicas orientadas para crianças e idosos na quadra do bairro, com foco em convivência e bem-estar.',
  },
  {
    id: 'horta', titulo: 'Horta Comunitária', categoria: 'Meio ambiente', slug: 'ambiente',
    status: 'Em andamento',
    descricao: 'Cultivo coletivo de hortaliças em terreno cedido, com a colheita dividida entre as famílias participantes.',
  },
  {
    id: 'reciclagem', titulo: 'Reciclagem Solidária', categoria: 'Meio ambiente', slug: 'ambiente',
    status: 'Inscrições encerradas', acao: 'Avise-me da próxima turma',
    descricao: 'Coleta e separação de recicláveis com cooperativa local. A próxima turma abre em breve; deixe seu contato para ser avisado.',
  },
];

/* ---------------- Utilitários ---------------- */
/** Escapa os caracteres que o HTML interpreta (&, <, >, " e '). */
export const esc = (t) =>
  String(t).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const tipoStatus = {
  'Em andamento': 'sucesso',
  'Vagas limitadas': 'aviso',
  'Inscrições encerradas': 'erro',
};

/* ---------------- Componentes ---------------- */
export const cardProjeto = (p, colunas = 'col-6 col-4') => `
  <article class="card ${colunas}" id="${esc(p.id)}">
    <div class="card__topo">
      <span class="badge badge--${tipoStatus[p.status] ?? 'info'}">${esc(p.status)}</span>
      <span class="badge badge--info">${esc(p.categoria)}</span>
    </div>
    <div class="card__corpo">
      <h2 class="card__titulo-h">${esc(p.titulo)}</h2>
      <p>${esc(p.descricao)}</p>
    </div>
    <a class="btn btn--secundario card__acao" href="#/cadastro">${esc(p.acao ?? 'Quero participar')}</a>
  </article>`;

export const listaProjetos = (lista, colunas) =>
  lista.length === 0
    ? `<div class="alert alert--info" role="status">
         <div class="alert__conteudo">
           <strong class="alert__titulo">Nenhum projeto encontrado</strong>
           <p class="alert__texto">Não há projetos nesta categoria. <a href="#/projetos">Ver todos os projetos</a>.</p>
         </div>
       </div>`
    : `<div class="grid">${lista.map((p) => cardProjeto(p, colunas)).join('')}</div>`;

/* ---------------- Telas ---------------- */
const telaInicio = () => `
  <section class="secao">
    <div class="container">
      <div class="grid grid--topo">
        <div class="col-8">
          <h1>Educação, saúde e meio ambiente perto de você</h1>
          <p class="lead">O Instituto Vida Nova organiza aulas de reforço, atendimento de saúde e ações ambientais nos bairros onde a comunidade mais precisa. Você pode ajudar com tempo ou com uma doação.</p>
          <div class="hero__acoes demo-linha">
            <a class="btn btn--doar" href="#/cadastro">Quero doar</a>
            <a class="btn btn--secundario" href="#/cadastro">Quero ser voluntário</a>
          </div>
        </div>
        <aside class="col-4" aria-label="Aviso">
          <div class="alert alert--aviso" role="status">
            <div class="alert__conteudo">
              <strong class="alert__titulo">Inscrições abertas</strong>
              <p class="alert__texto">O cadastro de novos voluntários vai até 30 de novembro.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </section>

  <section class="secao secao--branca" aria-labelledby="titulo-destaques">
    <div class="container">
      <h2 class="secao__titulo" id="titulo-destaques">Projetos em destaque</h2>
      ${listaProjetos(projetos.slice(0, 4), 'col-6 col-3')}
    </div>
  </section>

  <section class="secao">
    <div class="container">
      <h2>Como você pode ajudar</h2>
      <p class="lead">Escolha o que cabe na sua rotina. Toda contribuição chega a um projeto real.</p>
      <div class="demo-linha">
        <a class="btn btn--doar" href="#/cadastro">Fazer uma doação</a>
        <a class="btn btn--secundario" href="#/cadastro">Cadastrar-me como voluntário</a>
      </div>
    </div>
  </section>`;

/** `slug` vem da URL (#/projetos/educacao) e filtra a lista por categoria. */
const telaProjetos = (slug) => {
  const filtrados = slug ? projetos.filter((p) => p.slug === slug) : projetos;
  const categoria = projetos.find((p) => p.slug === slug)?.categoria;

  return `
  <section class="secao">
    <div class="container">
      <h1>Nossos projetos</h1>
      <p class="lead">Seis frentes de trabalho em três áreas. Em todas elas falta gente, e você pode entrar.</p>
      ${categoria
        ? `<p>Categoria: <strong>${esc(categoria)}</strong>. <a href="#/projetos">Ver todos os projetos</a></p>`
        : ''}
      ${listaProjetos(filtrados)}
    </div>
  </section>`;
};

const telaCadastro = () => `
  <section class="secao">
    <div class="container">
      <h1>Seja voluntário ou doador</h1>
      <p class="lead">Preencha o formulário e a equipe entra em contato em até cinco dias úteis.</p>

      <div class="grid grid--topo">
        <div class="col-8">
          <form class="form" data-form-cadastro novalidate>

            <div class="form__group">
              <label class="form__label" for="nome">Nome completo</label>
              <input type="text" id="nome" name="nome" required autocomplete="name" aria-describedby="nome-erro">
              <p class="form__erro" id="nome-erro" aria-live="polite"></p>
            </div>

            <div class="form__group">
              <label class="form__label" for="email">E-mail</label>
              <input type="email" id="email" name="email" required autocomplete="email" aria-describedby="email-erro">
              <p class="form__erro" id="email-erro" aria-live="polite"></p>
            </div>

            <div class="form__group">
              <label class="form__label" for="telefone">Telefone (opcional)</label>
              <input type="tel" id="telefone" name="telefone" placeholder="(00) 90000-0000" autocomplete="tel" aria-describedby="telefone-ajuda telefone-erro">
              <p class="form__ajuda" id="telefone-ajuda">Use o formato (00) 90000-0000.</p>
              <p class="form__erro" id="telefone-erro" aria-live="polite"></p>
            </div>

            <div class="form__group">
              <label class="form__label" for="interesse">Como você quer ajudar?</label>
              <select id="interesse" name="interesse" required aria-describedby="interesse-erro">
                <option value="">Selecione uma opção</option>
                <option value="voluntariado">Como voluntário</option>
                <option value="doacao">Com uma doação</option>
                <option value="parceria">Com uma parceria</option>
              </select>
              <p class="form__erro" id="interesse-erro" aria-live="polite"></p>
            </div>

            <div class="form__group">
              <label class="form__label" for="mensagem">Mensagem (opcional)</label>
              <textarea id="mensagem" name="mensagem" maxlength="500" aria-describedby="mensagem-ajuda"></textarea>
              <p class="form__ajuda" id="mensagem-ajuda">Até 500 caracteres. Conte sua disponibilidade ou dúvida.</p>
            </div>

            <div class="form__group">
              <label class="form__label form__check" for="aceite">
                <input type="checkbox" id="aceite" name="aceite" required aria-describedby="aceite-erro">
                <span>Concordo em receber contato do instituto e com o uso dos meus dados para esse fim, conforme a LGPD.</span>
              </label>
              <p class="form__erro" id="aceite-erro" aria-live="polite"></p>
            </div>

            <div class="form__actions">
              <button class="btn btn--secundario" type="reset">Limpar</button>
              <button class="btn" type="submit">Enviar cadastro</button>
            </div>
          </form>
        </div>

        <aside class="col-4" aria-label="Informações">
          <div class="alert alert--info" role="note">
            <div class="alert__conteudo">
              <strong class="alert__titulo">Antes de começar</strong>
              <p class="alert__texto">Os campos com asterisco (*) são obrigatórios. O que você digita fica salvo como rascunho neste navegador até o envio.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </section>`;

const tela404 = () => `
  <section class="secao">
    <div class="container">
      <h1>Página não encontrada</h1>
      <div class="alert alert--erro" role="alert">
        <div class="alert__conteudo">
          <strong class="alert__titulo">Esse endereço não existe</strong>
          <p class="alert__texto">Volte para o <a href="#/">início</a> ou veja os <a href="#/projetos">projetos</a>.</p>
        </div>
      </div>
    </div>
  </section>`;

/* ---------------- Tabela de rotas ---------------- */
export const rotas = {
  '/':         { titulo: 'Início',           template: telaInicio },
  '/projetos': { titulo: 'Projetos',         template: telaProjetos },
  '/cadastro': { titulo: 'Seja voluntário',  template: telaCadastro, aoCarregar: iniciarFormularioCadastro },
  '/404':      { titulo: 'Página não encontrada', template: tela404 },
};
