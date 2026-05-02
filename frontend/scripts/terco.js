// terco.js — fluxo principal: monta a sequência completa de etapas do terço

const Terco = (() => {

  // Monta a lista ordenada de etapas baseada nos mistérios do dia
  function montarSequencia(misterios) {
    const etapas = [];

    // 1. Sinal da Cruz
    etapas.push({
      tipo: 'oracao',
      id: 'sinal-da-cruz',
      nome: ORACOES.sinalDaCruz.nome,
      texto: ORACOES.sinalDaCruz.texto,
      secao: 'Abertura',
    });

    // 2. Creio
    etapas.push({
      tipo: 'oracao',
      id: 'credo',
      nome: ORACOES.credoApostolico.nome,
      texto: ORACOES.credoApostolico.texto,
      secao: 'Abertura',
    });

    // 3. Pai Nosso inicial
    etapas.push({
      tipo: 'padre',
      id: 'pai-nosso',
      nome: ORACOES.paiNosso.nome,
      texto: ORACOES.paiNosso.texto,
      secao: 'Abertura',
    });

    // 4. Três Ave Marias (fé, esperança, caridade)
    const intencoes = ['pela fé', 'pela esperança', 'pela caridade'];
    etapas.push({
      tipo: 'ave',
      id: 'ave-maria-abertura',
      nome: '3 Ave Marias',
      texto: ORACOES.aveMaria.texto,
      total: 3,
      intencoes,
      secao: 'Abertura',
    });

    // 5. Glória ao Pai inicial
    etapas.push({
      tipo: 'gloria',
      id: 'gloria-abertura',
      nome: ORACOES.gloriaAoPai.nome,
      texto: ORACOES.gloriaAoPai.texto,
      secao: 'Abertura',
    });

    // 6. Cinco mistérios
    misterios.lista.forEach((misterio, idx) => {
      // Anúncio do mistério
      etapas.push({
        tipo: 'misterio',
        id: `misterio-${idx + 1}`,
        nome: misterio.titulo,
        subtitulo: misterio.subtitulo,
        texto: misterio.meditacao,
        fruto: misterio.fruto,
        misterioIndex: idx,
        secao: `${idx + 1}º Mistério`,
      });

      // Pai Nosso do mistério
      etapas.push({
        tipo: 'padre',
        id: `pai-nosso-${idx + 1}`,
        nome: ORACOES.paiNosso.nome,
        texto: ORACOES.paiNosso.texto,
        misterioIndex: idx,
        secao: `${idx + 1}º Mistério`,
      });

      // 10 Ave Marias
      etapas.push({
        tipo: 'ave',
        id: `ave-maria-${idx + 1}`,
        nome: '10 Ave Marias',
        texto: ORACOES.aveMaria.texto,
        total: 10,
        misterioIndex: idx,
        secao: `${idx + 1}º Mistério`,
      });

      // Glória ao Pai
      etapas.push({
        tipo: 'gloria',
        id: `gloria-${idx + 1}`,
        nome: ORACOES.gloriaAoPai.nome,
        texto: ORACOES.gloriaAoPai.texto,
        misterioIndex: idx,
        secao: `${idx + 1}º Mistério`,
      });

      // Oração de Fátima
      etapas.push({
        tipo: 'fatima',
        id: `fatima-${idx + 1}`,
        nome: ORACOES.fatima.nome,
        texto: ORACOES.fatima.texto,
        misterioIndex: idx,
        secao: `${idx + 1}º Mistério`,
      });
    });

    // 7. Salve Rainha
    etapas.push({
      tipo: 'oracao',
      id: 'salve-rainha',
      nome: ORACOES.salveRainha.nome,
      texto: ORACOES.salveRainha.texto,
      secao: 'Encerramento',
    });

    // 8. Oração Final
    etapas.push({
      tipo: 'oracao',
      id: 'oracao-final',
      nome: ORACOES.oracao_final.nome,
      texto: ORACOES.oracao_final.texto,
      secao: 'Encerramento',
    });

    // 9. Agradecimento
    etapas.push({
      tipo: 'agradecimento',
      id: 'agradecimento',
      nome: ORACOES.agradecimento.nome,
      texto: ORACOES.agradecimento.texto,
      secao: 'Encerramento',
    });

    return etapas;
  }

  // Inicializa o terço com os mistérios do dia
  function iniciar(misterios) {
    const sequencia = montarSequencia(misterios);
    Contador.inicializar(sequencia);
  }

  // Calcula contagem total de Ave Marias já rezadas
  function contarAveMarias(estado) {
    const { etapas } = estado;
    let total = 0;
    // conta pelas etapas passadas
    return total;
  }

  return { iniciar, montarSequencia };
})();
