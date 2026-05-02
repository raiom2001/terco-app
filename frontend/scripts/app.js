// app.js — bootstrap, eventos e integração com API Flask

async function fetchLiturgiaDoDia() {
  try {
    const resp = await fetch('/api/liturgia');
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    return await resp.json();
  } catch (err) {
    console.warn('Backend indisponível, usando dados locais.', err);
    return { success: false, data: { misterios: getMisteriosDoDia(), origem: 'local-fallback' } };
  }
}

async function fetchLiturgiaDia() {
  const resp = await fetch('/api/liturgia-dia');
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  return await resp.json();
}

async function carregarLiturgia() {
  try {
    const resposta = await fetchLiturgiaDia();
    UI.setLiturgiaCarregada(true);
    UI.renderizarLiturgia(resposta.data || resposta);
  } catch (err) {
    console.error('Erro ao carregar liturgia:', err);
    UI.mostrarErroLiturgia();
  }
}

function registrarEventos(misterios) {
  // ── Terço ──
  document.getElementById('btn-avancar')?.addEventListener('click', () => {
    UI.pulsarConta();
    Contador.avancar();
  });
  document.getElementById('btn-voltar')?.addEventListener('click', () => Contador.voltar());
  document.getElementById('btn-resetar')?.addEventListener('click', () => {
    Contador.resetar();
    UI.esconderConcluido();
  });
  document.getElementById('btn-auto')?.addEventListener('click', () => {
    const est = Contador.getEstadoPublico();
    est.emAndamento ? Contador.pararAuto() : Contador.iniciarAuto();
  });
  document.getElementById('btn-novamente')?.addEventListener('click', () => {
    Contador.resetar();
    UI.esconderConcluido();
  });
  document.getElementById('slider-auto')?.addEventListener('input', (e) => {
    Contador.setIntervalo(e.target.value);
    const lbl = document.getElementById('label-auto');
    if (lbl) lbl.textContent = `${e.target.value}s`;
  });

  // ── Contemplação ──
  document.getElementById('cont-avancar')?.addEventListener('click', () => {
    UI.pulsarConta();
    Contador.avancar();
  });
  document.getElementById('cont-voltar')?.addEventListener('click', () => Contador.voltar());
  document.getElementById('cont-sair')?.addEventListener('click', () => UI.fecharContemplacao());
  document.getElementById('cont-toggle-texto')?.addEventListener('click', () => UI.toggleTextoContemplacao());

  // ── Leitor de liturgia ──
  document.getElementById('reader-fechar')?.addEventListener('click', () => UI.fecharReader());
  document.getElementById('reader-proxima')?.addEventListener('click', () => UI.proximaLeitura());
  document.getElementById('reader-anterior')?.addEventListener('click', () => UI.anteriorLeitura());

  // ── Tabs ──
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      UI.ativarTab(btn.dataset.tab);
      if (btn.dataset.tab === 'liturgia' && !UI.isLiturgiaCarregada()) {
        carregarLiturgia();
      }
    });
  });
  document.getElementById('lit-btn-recarregar')?.addEventListener('click', () => {
    document.getElementById('lit-erro')?.classList.add('hidden');
    document.getElementById('lit-loading')?.classList.remove('hidden');
    UI.setLiturgiaCarregada(false);
    carregarLiturgia();
  });

  // ── Teclado ──
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); UI.pulsarConta(); Contador.avancar(); }
    if (e.key === 'ArrowLeft')                   { e.preventDefault(); Contador.voltar(); }
    if (e.key === 'r' || e.key === 'R')           { Contador.resetar(); UI.esconderConcluido(); }
    if (e.key === 'Escape')                       { UI.fecharContemplacao(); UI.fecharReader(); }
  });
}

function conectarContador(misterios) {
  Contador.on('atualizado',  (est) => { UI.renderizar(est, misterios); UI.atualizarBtnAuto(est.emAndamento); });
  Contador.on('conta',       (est) => { UI.renderizar(est, misterios); });
  Contador.on('concluido',   ()     => { UI.mostrarConcluido(); });
  Contador.on('autoIniciado',(est)  => { UI.atualizarBtnAuto(true);  UI.renderizar(est, misterios); });
  Contador.on('autoParado',  (est)  => { UI.atualizarBtnAuto(false); UI.renderizar(est, misterios); });
}

async function main() {
  UI.init();
  const liturgia = await fetchLiturgiaDoDia();
  const misterios = liturgia.data.misterios;
  UI.exibirInfoDia(misterios);
  conectarContador(misterios);
  registrarEventos(misterios);
  Terco.iniciar(misterios);
}

document.addEventListener('DOMContentLoaded', main);

// Swipe horizontal para avançar/voltar
(function(){
  let startX = 0;
  const app = document.getElementById('app');
  app.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  app.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) < 50) return;
    if (diff > 0) { UI.pulsarConta(); Contador.avancar(); }
    else          { Contador.voltar(); }
  }, { passive: true });
})();
