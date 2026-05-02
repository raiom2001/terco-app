// app.js — inicialização e eventos globais

const API_BASE = 'https://terco-app.onrender.com';

document.addEventListener('DOMContentLoaded', () => {
  UI.init();
  UI.exibirInfoDia(Terco.getMisterios());
  Terco.iniciar();
  UI.renderizar(Terco.getEstado(), Terco.getMisterios());
  _bindEventos();
  _carregarLiturgia();
});

function _bindEventos() {
  document.getElementById('btn-avancar')?.addEventListener('click', () => {
    UI.pulsarConta();
    Terco.avancar();
    UI.renderizar(Terco.getEstado(), Terco.getMisterios());
  });

  document.getElementById('btn-voltar')?.addEventListener('click', () => {
    Terco.voltar();
    UI.renderizar(Terco.getEstado(), Terco.getMisterios());
  });

  document.getElementById('btn-resetar')?.addEventListener('click', () => {
    Terco.resetar();
    UI.renderizar(Terco.getEstado(), Terco.getMisterios());
  });

  document.getElementById('btn-novamente')?.addEventListener('click', () => {
    Terco.resetar();
    UI.esconderConcluido();
    UI.renderizar(Terco.getEstado(), Terco.getMisterios());
  });

  document.getElementById('cont-sair')?.addEventListener('click', () => {
    UI.fecharContemplacao();
  });

  document.getElementById('cont-avancar')?.addEventListener('click', () => {
    UI.pulsarConta();
    Terco.avancar();
    UI.renderizar(Terco.getEstado(), Terco.getMisterios());
  });

  document.getElementById('cont-voltar')?.addEventListener('click', () => {
    Terco.voltar();
    UI.renderizar(Terco.getEstado(), Terco.getMisterios());
  });

  document.getElementById('cont-toggle-texto')?.addEventListener('click', () => {
    UI.toggleTextoContemplacao();
  });

  document.getElementById('reader-fechar')?.addEventListener('click', () => {
    UI.fecharReader();
  });

  document.getElementById('reader-proxima')?.addEventListener('click', () => {
    UI.proximaLeitura();
  });

  document.getElementById('reader-anterior')?.addEventListener('click', () => {
    UI.anteriorLeitura();
  });

  document.getElementById('lit-btn-recarregar')?.addEventListener('click', () => {
    _carregarLiturgia();
  });

  // Tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const aba = btn.dataset.tab;
      UI.ativarTab(aba);
      if (aba === 'liturgia' && !UI.isLiturgiaCarregada()) {
        _carregarLiturgia();
      }
    });
  });

  // Auto
  const btnAuto   = document.getElementById('btn-auto');
  const sliderAuto = document.getElementById('slider-auto');
  const labelAuto  = document.getElementById('label-auto');

  sliderAuto?.addEventListener('input', () => {
    labelAuto.textContent = `${sliderAuto.value}s`;
    if (Contador.emAndamento()) Contador.reiniciar(Number(sliderAuto.value));
  });

  btnAuto?.addEventListener('click', () => {
    const intervalo = Number(sliderAuto?.value || 8);
    if (Contador.emAndamento()) {
      Contador.parar();
      UI.atualizarBtnAuto(false);
    } else {
      Contador.iniciar(intervalo, () => {
        UI.pulsarConta();
        Terco.avancar();
        UI.renderizar(Terco.getEstado(), Terco.getMisterios());
        if (Terco.getEstado().concluido) { Contador.parar(); UI.atualizarBtnAuto(false); }
      });
      UI.atualizarBtnAuto(true);
    }
  });

  // Swipe
  let startX = 0;
  const appEl = document.getElementById('app');
  appEl?.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  appEl?.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) < 50) return;
    if (diff > 0) { UI.pulsarConta(); Terco.avancar(); }
    else          { Terco.voltar(); }
    UI.renderizar(Terco.getEstado(), Terco.getMisterios());
  }, { passive: true });
}

async function _carregarLiturgia() {
  document.getElementById('lit-loading')?.classList.remove('hidden');
  document.getElementById('lit-erro')?.classList.add('hidden');
  document.getElementById('lit-lista')?.classList.add('hidden');

  try {
    const res  = await fetch(`${API_BASE}/api/liturgia-dia`);
    const json = await res.json();
    if (json.success) {
      UI.renderizarLiturgia(json.data);
      UI.setLiturgiaCarregada(true);
    } else {
      UI.mostrarErroLiturgia();
    }
  } catch (e) {
    UI.mostrarErroLiturgia();
  }
}

// Splash
(function(){
  const splash = document.getElementById('splash');
  if (!splash) return;
  window.addEventListener('load', () => {
    setTimeout(() => {
      gsap.to(splash, { opacity: 0, duration: 0.7, delay: 0.8,
        onComplete: () => splash.remove() });
    }, 300);
  });
})();
