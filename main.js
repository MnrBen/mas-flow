/* Mas Flow: JavaScript único y sin librerías. Si falla, todo el contenido se ve
   igual: aquí solo hay mejoras.
   1. Visor de fotos  2. Hoy en el horario */

document.addEventListener('DOMContentLoaded', () => {
  iniciarVisor();
  marcarHoy();
});

/* 2. HOY EN EL HORARIO ------------------------------------------------------
   Resalta el día actual con la hora de Errenteria, esté donde esté quien mira.
   No dice "abierto ahora": el horario aún está por confirmar. */
function marcarHoy() {
  const dias = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hoy = dias.indexOf(new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: 'Europe/Madrid' }).format(new Date()));
  document.querySelectorAll('.horario tr[data-dias]').forEach((fila) => {
    if (!fila.dataset.dias.split(',').includes(String(hoy))) return;
    fila.classList.add('hoy');
    fila.querySelector('th').append(' (hoy)');
  });
}

/* 1. VISOR DE FOTOS ---------------------------------------------------------
   Las fotos van en una pista con desplazamiento nativo, así siguen al dedo sin
   más código. Sin JS o sin <dialog>, los enlaces abren la foto directamente. */
function iniciarVisor() {
  const visor = document.getElementById('visor');
  const enlaces = [...document.querySelectorAll('[data-visor]')];
  if (!visor || !enlaces.length || typeof visor.showModal !== 'function') return;

  const pista = document.getElementById('visor-pista');
  const texto = document.getElementById('visor-texto');
  let actual = 0;

  // Una diapositiva por foto. La foto solo se pide al acercarse a ella.
  enlaces.forEach((enlace) => {
    const miniatura = enlace.querySelector('img');
    const diapositiva = document.createElement('div');
    diapositiva.className = 'visor-foto';
    const img = document.createElement('img');
    img.loading = 'lazy';
    img.width = miniatura.getAttribute('width');
    img.height = miniatura.getAttribute('height');
    img.alt = miniatura.alt;
    img.src = enlace.getAttribute('href');
    diapositiva.append(img);
    pista.append(diapositiva);
  });

  const titulo = (i) => enlaces[i].closest('.grupo').querySelector('h3').textContent;
  const pintarTexto = () => { texto.textContent = `${titulo(actual)} · ${actual + 1} de ${enlaces.length}`; };
  const sinMovimiento = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function irA(i, suave) {
    const destino = (i + enlaces.length) % enlaces.length;
    // Al dar la vuelta (de la última a la primera) se salta sin recorrerlas todas
    const salto = Math.abs(destino - actual) > 1;
    pista.scrollTo({ left: destino * pista.clientWidth, behavior: suave && !salto && !sinMovimiento() ? 'smooth' : 'auto' });
    actual = destino;
    pintarTexto();
  }

  enlaces.forEach((enlace, i) => {
    enlace.addEventListener('click', (evento) => {
      // Ctrl o Cmd + clic mantienen el comportamiento normal del enlace
      if (evento.metaKey || evento.ctrlKey || evento.shiftKey) return;
      evento.preventDefault();
      document.documentElement.classList.add('visor-abierto');
      visor.showModal();
      irA(i, false);
    });
  });

  // El dedo mueve la pista: el contador se actualiza al asentarse cada foto
  let pendiente = false;
  pista.addEventListener('scroll', () => {
    if (pendiente) return;
    pendiente = true;
    requestAnimationFrame(() => {
      pendiente = false;
      const i = Math.round(pista.scrollLeft / pista.clientWidth);
      if (i !== actual && i >= 0 && i < enlaces.length) { actual = i; pintarTexto(); }
    });
  });

  document.getElementById('visor-atras').addEventListener('click', () => irA(actual - 1, true));
  document.getElementById('visor-alante').addEventListener('click', () => irA(actual + 1, true));
  document.getElementById('visor-cerrar').addEventListener('click', () => visor.close());

  visor.addEventListener('keydown', (evento) => {
    if (evento.key === 'ArrowLeft') { evento.preventDefault(); irA(actual - 1, true); }
    if (evento.key === 'ArrowRight') { evento.preventDefault(); irA(actual + 1, true); }
  });

  // Pulsar fuera de la foto también cierra
  pista.addEventListener('click', (evento) => {
    if (evento.target.classList.contains('visor-foto')) visor.close();
  });

  visor.addEventListener('close', () => document.documentElement.classList.remove('visor-abierto'));

  // Si gira el móvil con el visor abierto, sigue en la misma foto
  window.addEventListener('resize', () => {
    if (visor.open) pista.scrollTo({ left: actual * pista.clientWidth, behavior: 'auto' });
  });
}
