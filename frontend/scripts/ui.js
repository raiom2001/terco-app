// ui.js — renderização, modo contemplação e leitor de liturgia

const UI = (() => {

  const els = {};
  let contemplacaoOculta = false;
  let leiturasDoDia      = [];
  let leiturasIdx        = 0;
  let liturgiaCarregada  = false;

  const TEMAS = {
    'Mistérios Gozosos':   { fundo: 'linear-gradient(160deg,#451a03,#92400e)', arco: '#f59e0b' },
    'Mistérios Dolorosos': { fundo: 'linear-gradient(160deg,#3f0000,#7f1d1d)', arco: '#ef4444' },
    'Mistérios Gloriosos': { fundo: 'linear-gradient(160deg,#1e0744,#4c1d95)', arco: '#a855f7' },
    'Mistérios Luminosos': { fundo: 'linear-gradient(160deg,#030714,#1e3a8a)', arco: '#3b82f6' },
  };

  const CHAVE_PASTA = {
    'Mistérios Gozosos': 'gozosos', 'Mistérios Dolorosos': 'dolorosos',
    'Mistérios Gloriosos': 'gloriosos', 'Mistérios Luminosos': 'luminosos',
  };

  // r=96  →  C = 2π×96 ≈ 603.2
  const CIRC = 2 * Math.PI * 96;

  // ── init ────────────────────────────────────────────────────────
  function init() {
    const q = id => document.getElementById(id);
    // Terço
    els.tituloOracao       = q('titulo-oracao');
    els.textoOracao        = q('texto-oracao');
    els.secao              = q('secao');
    els.cardOracao         = q('card-oracao');
    els.cardMisterio       = q('card-misterio');
    els.cardMisterioBanner = q('card-misterio-banner');
    els.cmIcone            = q('cm-icone');
    els.cmTitulo           = q('cm-titulo');
    els.cmSubtitulo        = q('cm-subtitulo');
    els.cmFruto            = q('cm-fruto');
    els.cmMeditacao        = q('cm-meditacao');
    els.contadorAbertura   = q('contador-abertura');
    els.progressBar        = q('progress-bar');
    els.progressText       = q('progress-text');
    els.telaOracao         = q('tela-oracao'); // não existe mais como wrapper; temos prayer-scroll
    els.telaConcluido      = q('tela-concluido');
    els.prayerScroll       = q('prayer-scroll');
    els.misterioGrupoNome  = q('misterio-grupo-nome');
    els.misterioGrupoIcone = q('misterio-grupo-icone');
    els.nomeDia            = q('nome-dia');
    // Contemplação
    els.contemplacao       = q('contemplacao');
    els.contBg             = q('cont-bg');
    els.contImg            = q('cont-img');
    els.contArc            = q('cont-arc');
    els.contNumero         = q('cont-numero');
    els.contTotalLabel     = q('cont-total-label');
    els.contDots           = q('cont-dots');
    els.contMisterioTitulo = q('cont-misterio-titulo');
    els.contMisterioSub    = q('cont-misterio-subtitulo');
    els.contFruto          = q('cont-fruto');
    els.contGrupoIcone     = q('cont-grupo-icone');
    els.contTextoWrapper   = q('cont-texto-wrapper');
    els.contTextoOracao    = q('cont-texto-oracao');
    // Leitor
    els.liturgiaReader     = q('liturgia-reader');
    els.readerTipo         = q('reader-tipo');
    els.readerRef          = q('reader-ref');
    els.readerCorpo        = q('reader-corpo');
    els.readerAclamacao    = q('reader-aclamacao');
    els.readerTexto        = q('reader-texto');
    els.readerAnterior     = q('reader-anterior');
    els.readerProxima      = q('reader-proxima');
  }

  // ── Renderização principal ──────────────────────────────────────
  function renderizar(estado, misterios) {
    if (!estado.etapa) return;
    const { etapa, contaAtual, progresso } = estado;
    const ehAveEmMisterio = etapa.tipo === 'ave' && etapa.misterioIndex !== undefined;

    // Barra de progresso
    if (els.progressBar)  gsap.to(els.progressBar, { width: `${progresso}%`, duration: 0.5, ease: 'power1.out' });
    if (els.progressText) els.progressText.textContent = `${estado.etapaIndex + 1} / ${estado.totalEtapas}`;

    // Header
    if (misterios) {
      if (els.misterioGrupoNome)  els.misterioGrupoNome.textContent  = misterios.nome;
      if (els.misterioGrupoIcone) els.misterioGrupoIcone.textContent = misterios.icone;
    }

    // Contemplação ou card normal
    if (ehAveEmMisterio && !contemplacaoOculta) {
      _atualizarContemplacao(etapa, contaAtual, misterios);
      _mostrarContemplacao();
    } else {
      if (!ehAveEmMisterio) contemplacaoOculta = false;
      _fecharContemplacaoSilencioso();
      _renderizarCard(etapa, contaAtual, misterios);
    }

    // Botão voltar
    const bv = document.getElementById('btn-voltar');
    if (bv) bv.disabled = estado.etapaIndex === 0 && estado.contaAtual === 0;
  }

  // ── Cards de oração ─────────────────────────────────────────────
  function _renderizarCard(etapa, contaAtual, misterios) {
    const ehMisterio    = etapa.tipo === 'misterio';
    const ehAveAbertura = etapa.tipo === 'ave' && etapa.misterioIndex === undefined;
    const cardAlvo      = ehMisterio ? els.cardMisterio : els.cardOracao;
    const cardSair      = ehMisterio ? els.cardOracao   : els.cardMisterio;

    // Scroll para o topo ao mudar de etapa
    if (els.prayerScroll) els.prayerScroll.scrollTop = 0;

    gsap.to(cardSair, { opacity: 0, y: -10, duration: 0.16, onComplete: () => {
      cardSair?.classList.add('hidden');
      cardAlvo?.classList.remove('hidden');
      els.telaConcluido?.classList.add('hidden');

      ehMisterio ? _preencherMisterio(etapa, misterios) : _preencherOracao(etapa, contaAtual, ehAveAbertura);

      gsap.fromTo(cardAlvo, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.32, ease: 'power2.out' });
    }});
  }

  function _preencherMisterio(etapa, misterios) {
    const tema = TEMAS[misterios?.nome] || TEMAS['Mistérios Gloriosos'];
    if (els.cardMisterioBanner) els.cardMisterioBanner.style.background = tema.fundo;
    if (els.cmIcone)     els.cmIcone.textContent     = misterios?.icone || '📿';
    if (els.cmTitulo)    els.cmTitulo.textContent    = etapa.nome;
    if (els.cmSubtitulo) els.cmSubtitulo.textContent = etapa.subtitulo || '';
    if (els.cmFruto)     els.cmFruto.textContent     = `Fruto: ${etapa.fruto || ''}`;
    if (els.cmMeditacao) els.cmMeditacao.textContent  = etapa.texto || '';
  }

  function _preencherOracao(etapa, contaAtual, ehAveAbertura) {
    if (els.secao)        els.secao.textContent        = etapa.secao || '';
    if (els.tituloOracao) els.tituloOracao.textContent = etapa.nome;
    if (els.textoOracao)  els.textoOracao.textContent  = etapa.texto || '';

    if (els.contadorAbertura) {
      if (ehAveAbertura) {
        const intencao = etapa.intencoes ? ` — ${etapa.intencoes[contaAtual] || ''}` : '';
        els.contadorAbertura.textContent = `${contaAtual + 1} de ${etapa.total}${intencao}`;
        els.contadorAbertura.classList.remove('hidden');
      } else {
        els.contadorAbertura.classList.add('hidden');
      }
    }
  }

  // ── Contemplação ────────────────────────────────────────────────
  function _atualizarContemplacao(etapa, contaAtual, misterios) {
    const idx   = etapa.misterioIndex;
    const info  = misterios.lista[idx];
    const total = etapa.total || 10;
    const tema  = TEMAS[misterios.nome] || TEMAS['Mistérios Gloriosos'];
    const pasta = CHAVE_PASTA[misterios.nome] || 'gloriosos';

    if (els.contGrupoIcone)     els.contGrupoIcone.textContent     = misterios.icone;
    if (els.contMisterioTitulo) els.contMisterioTitulo.textContent = info?.titulo || '';
    if (els.contMisterioSub)    els.contMisterioSub.textContent    = info?.subtitulo || '';
    if (els.contFruto)          els.contFruto.textContent          = `Fruto: ${info?.fruto || ''}`;
    if (els.contTextoOracao)    els.contTextoOracao.textContent    = ORACOES.aveMaria.texto;
    if (els.contNumero)         els.contNumero.textContent         = contaAtual + 1;
    if (els.contTotalLabel)     els.contTotalLabel.textContent     = `/ ${total}`;

    if (els.contArc) {
      els.contArc.style.stroke           = tema.arco;
      els.contArc.style.strokeDashoffset = CIRC - (contaAtual + 1) / total * CIRC;
    }

    if (els.contBg) els.contBg.style.background = tema.fundo;

    if (els.contImg) {
      els.contImg.style.display = '';
      els.contImg.src = `/assets/images/${pasta}/${idx + 1}.jpg`;
    }

    _renderizarDots(contaAtual, total, tema.arco);

    if (els.contNumero)
      gsap.fromTo(els.contNumero, { scale: 1.35, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.28, ease: 'back.out(2)' });
  }

  function _renderizarDots(contaAtual, total, cor) {
    if (!els.contDots) return;
    els.contDots.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const d = document.createElement('div');
      d.className = 'cont-dot';
      if (i < contaAtual)      d.style.cssText = `background:${cor};opacity:0.4`;
      else if (i === contaAtual) d.style.cssText = `background:${cor};transform:scale(1.6);box-shadow:0 0 8px ${cor}`;
      else                     d.style.cssText = 'background:rgba(255,255,255,0.15)';
      els.contDots.appendChild(d);
    }
  }

  function _mostrarContemplacao() {
    if (!els.contemplacao?.classList.contains('hidden')) return;
    els.contemplacao.classList.remove('hidden');
    gsap.fromTo(els.contemplacao, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power2.out' });
  }

  function _fecharContemplacaoSilencioso() {
    if (!els.contemplacao || els.contemplacao.classList.contains('hidden')) return;
    gsap.to(els.contemplacao, { opacity: 0, duration: 0.25,
      onComplete: () => els.contemplacao.classList.add('hidden') });
  }

  function fecharContemplacao() {
    contemplacaoOculta = true;
    _fecharContemplacaoSilencioso();
  }

  function toggleTextoContemplacao() {
    const w   = els.contTextoWrapper;
    const btn = document.getElementById('cont-toggle-texto');
    if (!w) return;
    const aberto = !w.classList.contains('hidden');
    w.classList.toggle('hidden', aberto);
    if (btn) btn.textContent = aberto ? 'Ver Ave Maria ▼' : 'Fechar ▲';
  }

  // ── Conclusão ────────────────────────────────────────────────────
  function mostrarConcluido() {
    _fecharContemplacaoSilencioso();
    els.cardOracao?.classList.add('hidden');
    els.cardMisterio?.classList.add('hidden');
    if (els.prayerScroll) els.prayerScroll.scrollTop = 0;
    if (!els.telaConcluido) return;
    els.telaConcluido.classList.remove('hidden');
    gsap.fromTo(els.telaConcluido, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(1.4)' });
  }

  function esconderConcluido() {
    els.telaConcluido?.classList.add('hidden');
    els.cardOracao?.classList.remove('hidden');
    gsap.fromTo(els.cardOracao, { opacity: 0 }, { opacity: 1, duration: 0.3 });
  }

  // ── Info do dia ──────────────────────────────────────────────────
  function exibirInfoDia(misterios) {
    const dias = ['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado'];
    if (els.nomeDia)            els.nomeDia.textContent            = dias[new Date().getDay()];
    if (els.misterioGrupoNome)  els.misterioGrupoNome.textContent  = misterios.nome;
    if (els.misterioGrupoIcone) els.misterioGrupoIcone.textContent = misterios.icone;
  }

  // ── Liturgia ─────────────────────────────────────────────────────
  function renderizarLiturgia(dados) {
    document.getElementById('lit-loading')?.classList.add('hidden');
    document.getElementById('lit-erro')?.classList.add('hidden');
    if (!dados) { mostrarErroLiturgia(); return; }

    const q  = id => document.getElementById(id);
    const set = (id, v) => { const e = q(id); if (e && v) e.textContent = v; };

    set('lit-data',          dados.data || '');
    set('lit-dia-liturgico', dados.dia || dados.liturgia || '');
    set('lit-cor-badge',     dados.cor ? dados.cor.charAt(0).toUpperCase() + dados.cor.slice(1) : '');

    leiturasDoDia = [];
    if (dados.primeiraLeitura) leiturasDoDia.push({ tipo:'1ª Leitura', icone:'📜', referencia: dados.primeiraLeitura.referencia, texto: dados.primeiraLeitura.texto, aclamacao: dados.primeiraLeitura.titulo });
    if (dados.salmo)           leiturasDoDia.push({ tipo:'Salmo Responsorial', icone:'🎵', referencia: dados.salmo.referencia, texto: dados.salmo.texto, aclamacao: dados.salmo.refrao || dados.salmo.resposta });
    if (dados.segundaLeitura)  leiturasDoDia.push({ tipo:'2ª Leitura', icone:'📜', referencia: dados.segundaLeitura.referencia, texto: dados.segundaLeitura.texto, aclamacao: dados.segundaLeitura.titulo });
    if (dados.evangelho)       leiturasDoDia.push({ tipo:'Evangelho', icone:'✝️', referencia: dados.evangelho.referencia, texto: dados.evangelho.texto, aclamacao: dados.evangelho.aclamacao || dados.evangelho.titulo });

    const container = q('lit-items');
    if (container) {
      container.innerHTML = '';
      leiturasDoDia.forEach((l, i) => {
        const btn = document.createElement('button');
        btn.className = 'touch-btn leitura-item';
        btn.innerHTML = `<span class="leitura-icone">${l.icone}</span><div class="leitura-info"><p class="leitura-tipo">${l.tipo}</p><p class="leitura-ref">${l.referencia || ''}</p></div><span class="leitura-seta">›</span>`;
        btn.addEventListener('click', () => abrirReader(i));
        container.appendChild(btn);
      });
    }

    q('lit-lista')?.classList.remove('hidden');
    gsap.fromTo('#lit-lista > *', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.07, ease: 'power2.out' });
  }

  function mostrarErroLiturgia() {
    document.getElementById('lit-loading')?.classList.add('hidden');
    document.getElementById('lit-erro')?.classList.remove('hidden');
  }

  // ── Leitor de leituras ───────────────────────────────────────────
  function abrirReader(idx) {
    leiturasIdx = idx;
    _renderizarReader(true, true); // primeiro render sem animação de saída
    if (!els.liturgiaReader) return;
    els.liturgiaReader.classList.remove('hidden');
    gsap.fromTo(els.liturgiaReader, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' });
  }

  function fecharReader() {
    if (!els.liturgiaReader) return;
    gsap.to(els.liturgiaReader, { opacity: 0, y: 40, duration: 0.25, ease: 'power2.in',
      onComplete: () => els.liturgiaReader.classList.add('hidden') });
  }

  function proximaLeitura() {
    if (leiturasIdx < leiturasDoDia.length - 1) { leiturasIdx++; _renderizarReader(true); }
  }

  function anteriorLeitura() {
    if (leiturasIdx > 0) { leiturasIdx--; _renderizarReader(false); }
  }

  function _renderizarReader(avancar = true, semAnimacao = false) {
    const l = leiturasDoDia[leiturasIdx];
    if (!l) return;

    const dir = avancar ? 22 : -22;

    const preencher = () => {
      if (els.readerTipo)      els.readerTipo.textContent  = l.tipo;
      if (els.readerRef)       els.readerRef.textContent   = l.referencia || '';
      if (els.readerTexto)     els.readerTexto.textContent = l.texto || '';

      if (els.readerAclamacao) {
        if (l.aclamacao) {
          els.readerAclamacao.textContent = l.aclamacao;
          els.readerAclamacao.classList.remove('hidden');
        } else {
          els.readerAclamacao.classList.add('hidden');
        }
      }

      if (els.readerCorpo) els.readerCorpo.scrollTop = 0;

      if (els.readerAnterior) els.readerAnterior.style.opacity = leiturasIdx === 0 ? '0.28' : '1';
      if (els.readerProxima)  els.readerProxima.style.opacity  = leiturasIdx === leiturasDoDia.length - 1 ? '0.28' : '1';
    };

    if (semAnimacao) { preencher(); return; }

    const targets = [els.readerTexto, els.readerAclamacao].filter(Boolean);
    gsap.to(targets, { opacity: 0, x: -dir, duration: 0.16, onComplete: () => {
      preencher();
      gsap.fromTo(targets, { opacity: 0, x: dir }, { opacity: 1, x: 0, duration: 0.28, ease: 'power2.out' });
    }});
  }

  // ── Tabs ─────────────────────────────────────────────────────────
  function ativarTab(aba) {
    document.getElementById('secao-terco')?.classList.toggle('hidden',    aba !== 'terco');
    document.getElementById('secao-liturgia')?.classList.toggle('hidden', aba !== 'liturgia');
    document.getElementById('tab-terco')?.classList.toggle('tab-ativo',    aba === 'terco');
    document.getElementById('tab-liturgia')?.classList.toggle('tab-ativo', aba === 'liturgia');
  }

  // ── Botão automático ─────────────────────────────────────────────
  function atualizarBtnAuto(emAndamento) {
    const btn = document.getElementById('btn-auto');
    if (!btn) return;
    btn.textContent = emAndamento ? '⏸ Pausar' : '▶ Auto';
    btn.classList.toggle('ativo', emAndamento);
  }

  // ── Feedback visual no avançar ───────────────────────────────────
  function pulsarConta() {
    const btn = document.getElementById('btn-avancar');
    if (btn) gsap.fromTo(btn, { scale: 0.95 }, { scale: 1, duration: 0.2, ease: 'back.out(3)' });
  }

  // ── Getters ──────────────────────────────────────────────────────
  function isLiturgiaCarregada()  { return liturgiaCarregada; }
  function setLiturgiaCarregada(v) { liturgiaCarregada = v; }
  function getLeituras()          { return leiturasDoDia; }

  return {
    init, renderizar,
    mostrarConcluido, esconderConcluido, exibirInfoDia, pulsarConta,
    fecharContemplacao, toggleTextoContemplacao,
    renderizarLiturgia, mostrarErroLiturgia,
    abrirReader, fecharReader, proximaLeitura, anteriorLeitura,
    ativarTab, atualizarBtnAuto,
    isLiturgiaCarregada, setLiturgiaCarregada, getLeituras,
  };
})();
