# Instituto Vida Nova — SPA (Experiência Prática III)

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

Repositório organizado segundo o padrão **GitFlow**, com quatro tipos de branch:

- **`main`** — código em produção. Só recebe merge de `develop` (fechamento de ciclo) ou de `hotfix/*` (correção urgente). Cada merge em `main` é uma versão publicada.
- **`develop`** — branch de integração. É onde as funcionalidades concluídas se encontram antes de ir pra produção. Sempre deve estar em estado funcional.
- **`feature/<nome>`** — uma branch por funcionalidade nova, criada a partir de `develop`. Ao concluir, abre-se um Pull Request de volta pra `develop`, com revisão antes do merge.
- **`hotfix/<nome>`** — correção urgente em produção, criada a partir de `main`. Ao concluir, faz merge tanto em `main` quanto em `develop`, pra a correção não se perder no próximo ciclo.

Commits seguem o padrão semântico (`feat:`, `fix:`, `chore:`, `docs:`, `style:`, `refactor:`), descrevendo a intenção da mudança, não só o arquivo alterado.
