export function nowInSaoPaulo() {
  // Usa o instante atual (UTC) sem ajustar manualmente; a conversão para fuso de SP
  // deve ser feita somente na consulta/visualização.
  return new Date();
}
