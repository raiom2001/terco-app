const UI = (() => {
  const els = {};
  let contemplacaoOculta = false;
  let leiturasDoDia      = [];
  let leiturasIdx        = 0;
  let liturgiaCarregada  = false;

  const TEMAS = {
    'Mistérios Gozosos':   { fundo: 'linear-gradient(160deg,#3b2000,#7a5c0a)', arco: '#b8952a' },
    'Mistérios Dolorosos': { fundo: 'linear-gradient(160deg,#2a0000,#7a1c1c)', arco: '#c0392b' },
    'Mistérios Gloriosos': { fundo: 'linear-gradient(160deg,#0a0a2e,#1a3a6b)', arco: '#b8952a' },
    'Mistérios Luminosos': { fundo: 'linear-gradient(160deg,#001a0f,#0a4a2a)', arco: '#b8952a' },
  };

  const CHAVE_PASTA = {
    'Mistérios Gozosos': 'gozosos', 'Mistérios Dolorosos': 'dolorosos',
    'Mistérios Gloriosos': 'gloriosos', 'Mistérios Luminosos': 'luminosos',
  };

  const CIRC = 2 * Math.PI * 96;

  function _svgMisterio(chave) {
    const svgs = {
      gozosos:   `<svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#b8952a" stroke-width="1.4"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>`,
      dolorosos: `<svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#b8952a" stroke-width="1.4"><line x1="12" y1="2" x2="12" y2="22"/><line x1="4" y1="8" x2="20" y2="8"/></svg>`,
      gloriosos: `<svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#b8952a" stroke-width="1.4"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>`,
      luminosos: `<svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#b8952a" stroke-width="1.4"><path d="M12 2a6 6 0 0 1 6 6c0 4-6 10-6 10S6 12 6 8a6 6 0 0 1 6-6z"/><circle cx="12" cy="8" r="2"/></svg>`,
    };
    return svgs[chave] || svgs.gloriosos;
  }

  const SVG_LEITURA   = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b8952a" stroke-width="1.6"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`;
  const SVG_SALMO     = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b8952a" stroke-width="1.6"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`;
  const SVG_EVANGELHO = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b8952a" stroke-width="1.6"><line x1="12" y1="2" x2="12" y2="22"/><line x1="4" y1="8" x2="20" y2="8"/></svg>`;
  const SVG_SETA      = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(184,149,42,0.35)" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>`;

  function init() {
    const q = id => document.getElementById(id);
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
    els.telaOracao         = q('tela-oracao');
    els.telaConcluido      = q('tela-concluido');
    els.prayerScroll       = q('prayer-scroll');
    els.misterioGrupoNome  = q('misterio-grupo-nome');
    els.misterioGrupoIcone = q('misterio-grupo-icone');
    els.nomeDia            = q('nome-dia');
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
    els.liturgiaReader     = q('liturgia-reader');
    els.readerTipo         = q('reader-tipo');
    els.readerRef          = q('reader-ref');
    els.readerCorpo        = q('reader-corpo');
    els.readerAclamacao    = q('reader-aclamacao');
    els.readerTexto        = q('reader-texto');
    els.readerAnterior     = q('reader-anterior');
    els.readerProxima      = q('reader-proxima');
  }

  function renderizar(estado, misterios) {
    if (!estado.etapa) return;
    const { etapa, contaAtual, progresso } = estado;
    const ehAveEmMisterio = etapa.tipo === 'ave' && etapa.misterioIndex !== undefined;
    if (els.progressBar)  gsap.to(els.progressBar, { width: `${progresso}%`, duration: 0.5, ease: 'power1.out' });
    if (els.progressText) els.progressText.textContent = `${estado.etapaIndex + 1} / ${estado.totalEtapas}`;
    if (misterios) {
      if (els.misterioGrupoNome)  els.misterioGrupoNome.textContent = misterios.nome;
      if (els.misterioGrupoIcone) els.misterioGrupoIcone.innerHTML =
        `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#b8952a" stroke-width="2.2"><line x1="12" y1="2" x2="12" y2="22"/><line x1="4" y1="8" x2="20" y2="8"/></svg>`;
    }
    if (ehAveEmMisterio && !contemplacaoOculta) {
      _atualizarContemplacao(etapa, contaAtual, misterios);
      _mostrarContemplacao();
    } else {
      if (!ehAveEmMisterio) contemplacaoOculta = false;
      _fecharContemplacaoSilencioso();
      _renderizarCard(etapa, contaAtual, misterios);
    }
    const bv = document.getElementById('btn-voltar');
    if (bv) bv.disabled = estado.etapaIndex === 0 && estado.contaAtual === 0;
  }

  function _renderizarCard(etapa, contaAtual, misterios) {
    const ehMisterio    = etapa.tipo === 'misterio';
    const ehAveAbertura = etapa.tipo === 'ave' && etapa.misterioIndex === undefined;
    const cardAlvo      = ehMisterio ? els.cardMisterio : els.cardOracao;
    const cardSair      = ehMisterio ? els.cardOracao   : els.cardMisterio;
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
    const tema  = TEMAS[misterios?.nome] || TEMAS['Mistérios Gloriosos'];
    const chave = CHAVE_PASTA[misterios?.nome] || 'gloriosos';
    if (els.cardMisterioBanner) els.cardMisterioBanner.style.background = tema.fundo;
    if (els.cmIcone)     els.cmIcone.innerHTML        = _svgMisterio(chave);
    if (els.cmTitulo)    els.cmTitulo.textContent     = etapa.nome;
    if (els.cmSubtitulo) els.cmSubtitulo.textContent  = etapa.subtitulo || '';
    if (els.cmFruto)     els.cmFruto.textContent      = `Fruto: ${etapa.fruto || ''}`;
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

  function _atualizarContemplacao(etapa, contaAtual, misterios) {
    const idx   = etapa.misterioIndex;
    const info  = misterios.lista[idx];
    const total = etapa.total || 10;
    const tema  = TEMAS[misterios.nome] || TEMAS['Mistérios Gloriosos'];
    const chave = CHAVE_PASTA[misterios.nome] || 'gloriosos';
    if (els.contGrupoIcone)     els.contGrupoIcone.innerHTML        = _svgMisterio(chave);
    if (els.contMisterioTitulo) els.contMisterioTitulo.textContent  = info?.titulo || '';
    if (els.contMisterioSub)    els.contMisterioSub.textContent     = info?.subtitulo || '';
    if (els.contFruto)          els.contFruto.textContent           = `Fruto: ${info?.fruto || ''}`;
    if (els.contTextoOracao)    els.contTextoOracao.textContent     = ORACOES.aveMaria.texto;
    if (els.contNumero)         els.contNumero.textContent          = contaAtual + 1;
    if (els.contTotalLabel)     els.contTotalLabel.textContent      = `/ ${total}`;
    if (els.contArc) {
      els.contArc.style.stroke           = tema.arco;
      els.contArc.style.strokeDashoffset = CIRC - (contaAtual + 1) / total * CIRC;
    }
    if (els.contBg) els.contBg.style.background = tema.fundo;
    if (els.contImg) { els.contImg.style.display = ''; els.contImg.src = `/assets/images/${chave}/${idx + 1}.jpg`; }
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
      if (i < contaAtual)        d.style.cssText = `background:${cor};opacity:0.4`;
      else if (i === contaAtual) d.style.cssText = `background:${cor};transform:scale(1.6);box-shadow:0 0 8px ${cor}`;
      else                       d.style.cssText = 'background:rgba(232,220,200,0.12)';
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
    gsap.to(els.contemplacao, { opacity: 0, duration: 0.25, onComplete: () => els.contemplacao.classList.add('hidden') });
  }

  function fecharContemplacao() { contemplacaoOculta = true; _fecharContemplacaoSilencioso(); }

  function toggleTextoContemplacao() {
    const w   = els.contTextoWrapper;
    const btn = document.getElementById('cont-toggle-texto');
    if (!w) return;
    const aberto = !w.classList.contains('hidden');
    w.classList.toggle('hidden', aberto);
    if (btn) btn.textContent = aberto ? 'Ver Ave Maria ▼' : 'Fechar ▲';
  }

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

  function exibirInfoDia(misterios) {
    const dias = ['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado'];
    if (els.nomeDia)            els.nomeDia.textContent           = dias[new Date().getDay()];
    if (els.misterioGrupoNome)  els.misterioGrupoNome.textContent = misterios.nome;
    if (els.misterioGrupoIcone) els.misterioGrupoIcone.innerHTML  =
      `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#b8952a" stroke-width="2.2"><line x1="12" y1="2" x2="12" y2="22"/><line x1="4" y1="8" x2="20" y2="8"/></svg>`;
  }

  function renderizarLiturgia(dados) {
    document.getElementById('lit-loading')?.classList.add('hidden');
    document.getElementById('lit-erro')?.classList.add('hidden');
    if (!dados) { mostrarErroLiturgia(); return; }
    const q   = id => document.getElementById(id);
    const set = (id, v) => { const e = q(id); if (e && v) e.textContent = v; };
    set('lit-data',          dados.data || '');
    set('lit-dia-liturgico', dados.dia || dados.liturgia || '');
    set('lit-cor-badge',     dados.cor ? dados.cor.charAt(0).toUpperCase() + dados.cor.slice(1) : '');
    leiturasDoDia = [];
    if (dados.primeiraLeitura) leiturasDoDia.push({ tipo:'1ª Leitura',        icone: SVG_LEITURA,   referencia: dados.primeiraLeitura.referencia, texto: dados.primeiraLeitura.texto,  aclamacao: dados.primeiraLeitura.titulo });
    if (dados.salmo)           leiturasDoDia.push({ tipo:'Salmo Responsorial', icone: SVG_SALMO,     referencia: dados.salmo.referencia,           texto: dados.salmo.texto,            aclamacao: dados.salmo.refrao || dados.salmo.resposta });
    if (dados.segundaLeitura)  leiturasDoDia.push({ tipo:'2ª Leitura',         icone: SVG_LEITURA,   referencia: dados.segundaLeitura.referencia,  texto: dados.segundaLeitura.texto,   aclamacao: dados.segundaLeitura.titulo });
    if (dados.evangelho)       leiturasDoDia.push({ tipo:'Evangelho',           icone: SVG_EVANGELHO, referencia: dados.evangelho.referencia,       texto: dados.evangelho.texto,        aclamacao: dados.evangelho.aclamacao || dados.evangelho.titulo });
    const container = q('lit-items');
    if (container) {
      container.innerHTML = '';
      leiturasDoDia.forEach((l, i) => {
        const btn = document.createElement('button');
        btn.className = 'touch-btn leitura-item';
        btn.innerHTML = `<span class="leitura-icone">${l.icone}</span><div class="leitura-info"><p class="leitura-tipo">${l.tipo}</p><p class="leitura-ref">${l.referencia || ''}</p></div><span class="leitura-seta">${SVG_SETA}</span>`;
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

  function abrirReader(idx) {
    leiturasIdx = idx;
    _renderizarReader(true, true);
    if (!els.liturgiaReader) return;
    els.liturgiaReader.classList.remove('hidden');
    gsap.fromTo(els.liturgiaReader, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' });
  }

  function fecharReader() {
    if (!els.liturgiaReader) return;
    gsap.to(els.liturgiaReader, { opacity: 0, y: 40, duration: 0.25, ease: 'power2.in', onComplete: () => els.liturgiaReader.classList.add('hidden') });
  }

  function proximaLeitura() { if (leiturasIdx < leiturasDoDia.length - 1) { leiturasIdx++; _renderizarReader(true); } }
  function anteriorLeitura() { if (leiturasIdx > 0) { leiturasIdx--; _renderizarReader(false); } }

  function _renderizarReader(avancar = true, semAnimacao = false) {
    const l = leiturasDoDia[leiturasIdx];
    if (!l) return;
    const dir = avancar ? 22 : -22;
    const preencher = () => {
      if (els.readerTipo)  els.readerTipo.textContent  = l.tipo;
      if (els.readerRef)   els.readerRef.textContent   = l.referencia || '';
      if (els.readerTexto) els.readerTexto.textContent = l.texto || '';
      if (els.readerAclamacao) {
        if (l.aclamacao) { els.readerAclamacao.textContent = l.aclamacao; els.readerAclamacao.classList.remove('hidden'); }
        else { els.readerAclamacao.classList.add('hidden'); }
      }
      if (els.readerCorpo)    els.readerCorpo.scrollTop    = 0;
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

  function ativarTab(aba) {
    document.getElementById('secao-terco')?.classList.toggle('hidden',    aba !== 'terco');
    document.getElementById('secao-liturgia')?.classList.toggle('hidden', aba !== 'liturgia');
    document.getElementById('tab-terco')?.classList.toggle('tab-ativo',    aba === 'terco');
    document.getElementById('tab-liturgia')?.classList.toggle('tab-ativo', aba === 'liturgia');
  }

  function atualizarBtnAuto(emAndamento) {
    const btn = document.getElementById('btn-auto');
    if (!btn) return;
    btn.textContent = emAndamento ? '⏸ Pausar' : '▶ Auto';
    btn.classList.toggle('ativo', emAndamento);
  }

  function pulsarConta() {
    const btn = document.getElementById('btn-avancar');
    if (btn) gsap.fromTo(btn, { scale: 0.95 }, { scale: 1, duration: 0.2, ease: 'back.out(3)' });
  }

  function isLiturgiaCarregada()   { return liturgiaCarregada; }
  function setLiturgiaCarregada(v) { liturgiaCarregada = v; }
  function getLeituras()           { return leiturasDoDia; }

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
