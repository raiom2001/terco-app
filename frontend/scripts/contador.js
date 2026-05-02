// contador.js — lógica de contagem e estado do terço

const Contador = (() => {
  // Estado interno
  let estado = {
    etapaIndex: 0,      // índice na sequência de etapas
    contaAtual: 0,      // conta dentro da etapa (para Ave Marias)
    misterioAtual: 0,   // índice do mistério atual (0-4)
    concluido: false,
    emAndamento: false,
    autoTimer: null,
    intervaloSegundos: 8,
  };

  let sequencia = [];   // lista de etapas gerada por terco.js
  let callbacks = {};   // hooks registrados externamente

  // Registra handlers externos
  function on(evento, fn) {
    callbacks[evento] = fn;
  }

  function emit(evento, dados) {
    if (callbacks[evento]) callbacks[evento](dados);
  }

  // Inicializa com a sequência de etapas
  function inicializar(seq) {
    sequencia = seq;
    estado = {
      etapaIndex: 0,
      contaAtual: 0,
      misterioAtual: 0,
      concluido: false,
      emAndamento: false,
      autoTimer: null,
      intervaloSegundos: estado.intervaloSegundos,
    };
    emit('atualizado', getEstadoPublico());
  }

  function getEtapaAtual() {
    return sequencia[estado.etapaIndex] || null;
  }

  function getEstadoPublico() {
    const etapa = getEtapaAtual();
    return {
      etapaIndex: estado.etapaIndex,
      totalEtapas: sequencia.length,
      contaAtual: estado.contaAtual,
      misterioAtual: estado.misterioAtual,
      concluido: estado.concluido,
      emAndamento: estado.emAndamento,
      etapa,
      progresso: sequencia.length > 0 ? Math.round((estado.etapaIndex / sequencia.length) * 100) : 0,
    };
  }

  // Avança para a próxima etapa ou conta
  function avancar() {
    if (estado.concluido) return;

    const etapa = getEtapaAtual();
    if (!etapa) return;

    // Se for ave maria em sequência (10 contas ou 3 contas), avança a conta
    if (etapa.tipo === 'ave' && etapa.total > 1) {
      if (estado.contaAtual < etapa.total - 1) {
        estado.contaAtual++;
        emit('conta', getEstadoPublico());
        return;
      }
    }

    // Passou da última conta — avança de etapa
    estado.contaAtual = 0;
    estado.etapaIndex++;

    if (estado.etapaIndex >= sequencia.length) {
      estado.concluido = true;
      pararAuto();
      emit('concluido', getEstadoPublico());
      return;
    }

    const proxima = getEtapaAtual();
    if (proxima && proxima.misterioIndex !== undefined) {
      estado.misterioAtual = proxima.misterioIndex;
    }

    emit('atualizado', getEstadoPublico());
  }

  // Volta para a etapa anterior
  function voltar() {
    if (estado.etapaIndex === 0 && estado.contaAtual === 0) return;

    if (estado.concluido) {
      estado.concluido = false;
    }

    const etapa = getEtapaAtual();
    if (etapa && etapa.tipo === 'ave' && etapa.total > 1 && estado.contaAtual > 0) {
      estado.contaAtual--;
      emit('conta', getEstadoPublico());
      return;
    }

    if (estado.etapaIndex > 0) {
      estado.etapaIndex--;
      estado.contaAtual = 0;
      const atual = getEtapaAtual();
      if (atual && atual.misterioIndex !== undefined) {
        estado.misterioAtual = atual.misterioIndex;
      }
    }

    emit('atualizado', getEstadoPublico());
  }

  // Reinicia do zero
  function resetar() {
    pararAuto();
    estado.etapaIndex = 0;
    estado.contaAtual = 0;
    estado.misterioAtual = 0;
    estado.concluido = false;
    emit('atualizado', getEstadoPublico());
  }

  // Inicia avanço automático
  function iniciarAuto() {
    if (estado.emAndamento) return;
    estado.emAndamento = true;
    estado.autoTimer = setInterval(() => {
      if (estado.concluido) {
        pararAuto();
        return;
      }
      avancar();
    }, estado.intervaloSegundos * 1000);
    emit('autoIniciado', getEstadoPublico());
  }

  // Para avanço automático
  function pararAuto() {
    if (estado.autoTimer) {
      clearInterval(estado.autoTimer);
      estado.autoTimer = null;
    }
    estado.emAndamento = false;
    emit('autoParado', getEstadoPublico());
  }

  function setIntervalo(segundos) {
    estado.intervaloSegundos = Math.max(3, Number(segundos));
    if (estado.emAndamento) {
      pararAuto();
      iniciarAuto();
    }
  }

  return {
    inicializar,
    avancar,
    voltar,
    resetar,
    iniciarAuto,
    pararAuto,
    setIntervalo,
    getEstadoPublico,
    on,
  };
})();
