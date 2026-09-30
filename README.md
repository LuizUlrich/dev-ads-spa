# Instituto Vida Nova — SPA (Experiências Práticas III e IV)

Single Page Application em HTML, CSS e JavaScript puros (módulos ES6), sem frameworks.

## Como rodar

Módulos ES6 não funcionam abrindo o arquivo direto (`file://`). Use um servidor local
(por exemplo, a extensão Live Server do VS Code) com esta pasta como raiz e abra:

    http://127.0.0.1:5500/html/index.html

## Estrutura

    /html      index.html: único documento (cabeçalho, contêiner #app, modal, rodapé)
    /css       style.css: design system, grid de 12 colunas, componentes e breakpoints
    /imagens   logo.svg e favicon.svg
    /js
      main.js            ponto de entrada; inicia menu, UI global e roteador
      /vendor
        imask.min.js     biblioteca IMask 7.6.1 (MIT), máscara do telefone; licença em LICENSE-imask.txt
      /modules
        router.js        roteador por hash (#/projetos, #/projetos/educacao)
        templates.js     dados dos projetos, componentes (template literals) e telas
        storage.js       leitura/gravação no localStorage, com tratamento de erro
        validacao.js     validação do formulário de cadastro, rascunho e envio
        ui.js            menu hambúrguer, modal e toast

## Rotas

    #/                     início
    #/projetos             todos os projetos
    #/projetos/educacao    projetos filtrados por categoria (educacao, saude, ambiente)
    #/cadastro             formulário de voluntário/doador
    (qualquer outra)       página 404

## localStorage (prefixo `vidanova:`)

    vidanova:rascunho    campos do formulário em preenchimento (apagado ao enviar ou limpar)
    vidanova:cadastros   lista de cadastros enviados neste navegador

Observação: os cadastros ficam só no navegador de quem preencheu. Não há back-end.

## Biblioteca externa

IMask 7.6.1 (MIT), copiada do pacote npm para `js/vendor/`. Formata o telefone enquanto a pessoa digita:
`(00) 0000-0000` (10 dígitos) ou `(00) 00000-0000` (11). É opcional: se o script não carregar, o formulário
funciona sem máscara. A validação (RegEx) continua sendo a garantia final.

## Versionamento

Repositório organizado segundo o padrão **GitFlow**, com cinco tipos de branch:

- **`main`** — código em produção. Só recebe merge de `develop` (fechamento de ciclo) ou de `hotfix/*` (correção urgente). Cada merge em `main` é publicado em produção; os que mudam comportamento recebem uma tag de versão.
- **`develop`** — branch de integração. É onde as funcionalidades concluídas se encontram antes de ir pra produção. Sempre deve estar em estado funcional.
- **`feature/<nome>`** — uma branch por funcionalidade nova, criada a partir de `develop`. Ao concluir, abre-se um Pull Request de volta pra `develop`, com revisão antes do merge.
- **`hotfix/<nome>`** — correção urgente em produção, criada a partir de `main`. Ao concluir, faz merge tanto em `main` quanto em `develop`, pra a correção não se perder no próximo ciclo.
- **`docs/<nome>`** — mudanças só de documentação. Segue o mesmo fluxo de `feature/*`: sai de `develop` e volta por Pull Request.

### Commits semânticos

Commits seguem o padrão semântico (Conventional Commits), descrevendo a intenção da mudança, não só o arquivo alterado:

| Prefixo     | Uso                                                        |
|-------------|------------------------------------------------------------|
| `feat:`     | funcionalidade nova                                        |
| `fix:`      | correção de bug                                            |
| `docs:`     | documentação                                               |
| `style:`    | formatação, sem mudar comportamento                        |
| `refactor:` | reorganização de código, sem mudar comportamento           |
| `chore:`    | tarefas de manutenção (configuração, dependências, etc.)   |

### Versionamento semântico (SemVer)

As versões seguem o formato **`MAJOR.MINOR.PATCH`** ([semver.org](https://semver.org/lang/pt-BR/)):

- **MAJOR** — mudança incompatível (ex.: rotas renomeadas, formato do `localStorage` alterado sem migração).
- **MINOR** — funcionalidade nova compatível com o que já existe (em geral, commits `feat:`).
- **PATCH** — correção compatível (em geral, commits `fix:`, incluindo os que vêm de `hotfix/*`).

Mudanças só em `docs:`, `style:` ou `chore:` não exigem versão nova por si só.

### Releases

1. As mudanças são integradas em `develop` via Pull Request.
2. Ao fechar um ciclo, `develop` é mesclada em `main`.
3. Se o ciclo mudou comportamento, o commit resultante em `main` recebe uma **tag anotada** com a versão, que é enviada ao GitHub:

       git tag -a v1.1.0 -m "Release v1.1.0: <resumo>"
       git push origin v1.1.0

| Versão   | Descrição                                               |
|----------|---------------------------------------------------------|
| `v1.0.0` | deploy inicial do Instituto Vida Nova via GitHub Pages  |
| `v1.1.0` | acessibilidade WCAG 2.1 (ARIA, dark mode) e build/deploy via Vite + GitHub Actions |

## Deploy

Publicado com **GitHub Pages** a partir da branch `main`, pasta `/` (raiz). Todo push em `main` gera um novo deploy automaticamente.

**Produção:** https://luizulrich.github.io/dev-ads-spa/

O `index.html` da raiz só redireciona para `html/index.html`, que é o app de fato. Como os caminhos dos arquivos são relativos e as rotas usam hash (`#/...`), o site funciona no subcaminho `/dev-ads-spa/` sem configuração extra.
