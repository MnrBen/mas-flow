/* Mas Flow: JavaScript único y sin librerías. Si falla, todo el contenido se ve
   igual: aquí solo hay mejoras.
   1. Animaciones  2. Visor de fotos  3. Hoy en el horario */

// Este archivo se carga en <head> para activar las animaciones antes de pintar
prepararAnimaciones();

document.addEventListener('DOMContentLoaded', () => {
  iniciarVisor();
  marcarHoy();
  observarGrupos();
});

/* 1. ANIMACIONES ------------------------------------------------------------
   Solo dos gestos: el nombre de la portada entra de arriba abajo, como pasar
   la máquina, y las fotos aparecen al llegar a cada grupo. Las secciones a las
   que lleva un enlace # no se animan. Solo se activan aquí: sin JS o con
   "reducir movimiento" no hay ninguna y todo se ve desde el principio. */
function prepararAnimaciones() {
  const quiereMovimiento = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!quiereMovimiento) return;
  if ('IntersectionObserver' in window) document.documentElement.classList.add('anima');

  // Desplazamiento suave solo tras cargar: activo durante la carga, Safari corta
  // a medias el salto de una dirección con # y deja la sección fuera de sitio
  window.addEventListener('load', () => document.documentElement.classList.add('suave'));
}

function observarGrupos() {
  if (!document.documentElement.classList.contains('anima')) return;
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;
      entrada.target.classList.add('visto');
      observador.unobserve(entrada.target);
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.grupo').forEach((grupo) => observador.observe(grupo));
}

/* 3. HOY EN EL HORARIO ------------------------------------------------------
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

/* 2. VISOR DE FOTOS ---------------------------------------------------------
   Las fotos van en una pista con desplazamiento nativo, así siguen al dedo sin
   más código. Sin JS o sin <dialog>, los enlaces abren la foto directamente. */
function iniciarVisor() {
  const visor = document.getElementById('visor');
  const enlaces = [...document.querySelectorAll('[data-visor]')];
  if (!visor || !enlaces.length || typeof visor.showModal !== 'function') return;

  const pista = document.getElementById('visor-pista');
  const texto = document.getElementById('visor-texto');
  let actual = 0;
  let origen = null;

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
  // En dos líneas (white-space: pre-line) para que no se parta el contador
  const pintarTexto = () => { texto.textContent = `${titulo(actual)}\n${actual + 1} de ${enlaces.length}`; };
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
      origen = enlace;
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

  // Safari no enfoca los enlaces al pulsarlos: el foco se devuelve a mano
  visor.addEventListener('close', () => {
    document.documentElement.classList.remove('visor-abierto');
    if (origen) origen.focus({ preventScroll: true });
  });

  // Si gira el móvil con el visor abierto, sigue en la misma foto
  window.addEventListener('resize', () => {
    if (visor.open) pista.scrollTo({ left: actual * pista.clientWidth, behavior: 'auto' });
  });
}
