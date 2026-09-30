/* ==========================================================================
   storage.js — leitura e gravação no localStorage
   Todas as chaves ganham um prefixo para não colidir com outros projetos
   e toda operação é protegida: o localStorage pode estar bloqueado
   (modo privado, cota cheia) e o site precisa continuar funcionando.
   ========================================================================== */

const PREFIXO = 'vidanova:';

/** Lê e converte de JSON. Devolve `padrao` se não existir ou se estiver corrompido. */
export function ler(chave, padrao = null) {
  try {
    const bruto = localStorage.getItem(PREFIXO + chave);
    return bruto === null ? padrao : JSON.parse(bruto);
  } catch {
    return padrao;
  }
}

/** Grava como JSON. Devolve true se conseguiu, false se falhou. */
export function salvar(chave, valor) {
  try {
    localStorage.setItem(PREFIXO + chave, JSON.stringify(valor));
    return true;
  } catch {
    return false;
  }
}

/** Remove uma chave. */
export function remover(chave) {
  try {
    localStorage.removeItem(PREFIXO + chave);
  } catch {
    /* sem armazenamento disponível: nada a remover */
  }
}
