// app.js — bootstrap e eventos

document.addEventListener('DOMContentLoaded', () => {
  const misterios = getMisteriosDoDia();
  UI.init();
  UI.exibirInfoDia(misterios);
  Terco.iniciar(misterios);
  UI.renderizar(Terco.getEstado(), misterios);
  _bindEventos(misterios);
});

function _bindEventos(misterios) {
  document.getElementById('btn-avancar')?.addEventListener('click', () => {
    UI.pulsarConta();
    Terco.avancar();
    UI.renderizar(Terco.getEstado(), misterios);
  });
  document.getElementById('btn-voltar')?.addEventListener('click', () => {
    Terco.voltar();
    UI.renderizar(Terco.getEstado(), misterios);
  });
  document.getElementById('btn-resetar')?.addEventListener('click', () => {
    Terco.resetar();
    UI.renderizar(Terco.getEstado(), misterios);
  });
  document.getElementById('btn-novamente')?.addEventListener('click', () => {
    Terco.resetar();
    UI.esconderConcluido();
    UI.renderizar(Terco.getEstado(), misterios);
  });
  document.getElementById('cont-sair')?.addEventListener('click', () => UI.fecharContemplacao());
  document.getElementById('cont-avancar')?.addEventListener('click', () => {
    UI.pulsarConta();
    Terco.avancar();
    UI.renderizar(Terco.getEstado(), misterios);
  });
  document.getElementById('cont-voltar')?.addEventListener('click', () => {
    Terco.voltar();
    UI.renderizar(Terco.getEstado(), misterios);
  });
  document.getElementById('cont-toggle-texto')?.addEventListener('click', () => UI.toggleTextoContemplacao());

  const btnAuto    = document.getElementById('btn-auto');
  const sliderAuto = document.getElementById('slider-auto');
  const labelAuto  = document.getElementById('label-auto');

  sliderAuto?.addEventListener('input', () => {
    if (labelAuto) labelAuto.textContent = `${sliderAuto.value}s`;
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
        UI.renderizar(Terco.getEstado(), misterios);
        if (Terco.getEstado().concluido) { Contador.parar(); UI.atualizarBtnAuto(false); }
      });
      UI.atualizarBtnAuto(true);
    }
  });

  let startX = 0;
  const appEl = document.getElementById('app');
  appEl?.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  appEl?.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) < 50) return;
    if (diff > 0) { UI.pulsarConta(); Terco.avancar(); }
    else { Terco.voltar(); }
    UI.renderizar(Terco.getEstado(), misterios);
  }, { passive: true });
}

(function(){
  const splash = document.getElementById('splash');
  if (!splash) return;
  window.addEventListener('load', () => {
    setTimeout(() => {
      gsap.to(splash, { opacity: 0, duration: 0.7, delay: 0.8, onComplete: () => splash.remove() });
    }, 300);
  });
})();
