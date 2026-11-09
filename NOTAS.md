# Notas internas de la demo de Mas Flow

Documento de trabajo. No se publica ni se enseña al cliente tal cual.

## Propuesta (identidad y estructura)

El brief pide hacer la demo sin parar a preguntar, así que esta propuesta no
pasó por visto bueno previo: se revisa con la demo ya hecha.

- **Idea:** el degradado como identidad. Un fade es una transición limpia de
  lleno a nada; aquí esa transición se ve en el nombre del negocio y en el
  paso entre secciones.
- **Paleta (demo-v2, urbana):** el lima del local se veía infantil y venía con
  el local, no lo eligieron ellos. Ahora:
  - Tinta `#0E1624`: el azul dominicano llevado casi a negro, para cabecera,
    servicios, reseñas y contacto.
  - Hormigón `#EBE9E5` de base.
  - Dorado `#F2C230`, de la camiseta del Domi y del marco del espejo: único
    color de la acción.
  - Sin negro puro ni rojo, para no parecerse a OG.
  - La v1, con el lima, sigue en la etiqueta `demo-v1`.
- **Tipografías:** Shrikhand (gruesa, inclinada, de rótulo pintado a mano: da
  movimiento, el "flow") y Onest (texto, clara y cercana).
- **Recurso propio:** las rayas del fade, que adelgazan hasta desaparecer. Solo
  en el nombre de la portada y en dos transiciones de sección.
- **Apuesta llamativa (una sola):** el nombre gigante en la portada, con la
  parte baja de las letras "degradada" como un corte.
- **Fondos:** blanco, lima, blanco roto y azul. Nunca dos iguales seguidos.
- **Bloques:** portada, servicios, trabajos con reseñas, contacto con mapa y
  pie con aviso legal. Ni uno más.

## Fotos: decisiones

| Foto | Qué pasa | Decisión |
| --- | --- | --- |
| `trenzas-5` | Gran foto; el primer recorte le cortaba la cara | Portada (demo-v2), recortada de nuevo con la cara entera; se repite al final de Trenzas |
| `degradado-4` | Nítida, fade limpio, 752 px | Galería, en Degradados |
| `trenzas-3`, `-4`, `-5`, `degradado-3` | Capas con "BARBER SHOP / PREMIUM QUALITY / SINCE 2019" de la marca de la capa | Recortadas en `img/` para quitar el rótulo, también en el visor: "since 2019" parece la fecha del negocio. Además esas capas son negras y rojas, justo lo de OG |
| `degradado-1` | Capa de billetes; suelo oscuro y ropa colgada: no parece el local blanco | Se usa por el corte. Preguntar dónde se hizo |
| `diseno-3` | Pared gris, no parece el local actual | Se usa por el corte. Preguntar |
| `equipo-1` | 410 × 312 px, otro local (suelo beige, mural de Nueva York), personas sin identificar | **No se usa.** Es la única con el Domi sonriendo: pedirle una foto así en el local actual |
| `barbero-1` | El Domi con pose seria y manos; le da carácter pero no enseña lo majo que es | Se usa en contacto, a tamaño contenido. Valorar con él si la prefiere sonriendo |
| `diseno-1`, `-2`, `degradado-3`, `trenzas-1`, `-2` | Unos 410 px de ancho | Nunca por encima de su tamaño real |

### Permisos y privacidad antes de publicar

- **Todas las fotos muestran clientes reconocibles.** Hace falta su permiso
  para usarlas en la web, además del de Instagram.
- **Menores:** `diseno-3` es claramente un niño, y `diseno-2`, `degradado-2` y
  `degradado-3` pueden ser menores. Para publicar hace falta consentimiento de
  madre, padre o tutor; si no, se retiran.
- Las capas son de una marca de productos, no del negocio. Sus diseños se ven
  en algunas fotos.
- En `degradado-3` y `diseno-2` se ven transeúntes de lejos en la calle.
- Las fotos vienen de Instagram y su calidad es limitada. Mejoraría mucho con
  fotos originales del móvil del Domi.

## Pendientes de confirmar con el dueño

La web está preparada para añadirlos; ninguno se ha inventado.

- **Logo:** no hay archivo, se usa "Mas Flow" como texto.
- **Horario:** la ficha de Google tiene datos raros (viernes hasta las 24:00, y
  sábado de 0:00 a 7:00, franja que el brief ya quitó). La web dice que es el
  de la ficha de Google. Al confirmar, quitar esa frase de `index.html` y
  revisar el JSON-LD, que también lleva `24:00` el viernes.
- **Trenzas:** si se hacen en la barbería o en el local de Caro, y su Instagram.
  La web no dice dónde: hay un hueco comentado en `index.html`.
- **Precios:** no hay. Hueco comentado en `index.html`.
- **Titular:** nombre completo del dueño y datos para `legal.html`, que solo
  tiene huecos: no se ha escrito texto legal.
- **Instagram de cita:** el botón abre el perfil, no un mensaje directo.

## Terceros y privacidad

- **Google Fonts** y **Google Maps** son peticiones a Google desde el navegador
  del visitante, con su IP. Revisar antes de publicar: servir las fuentes desde
  el propio dominio y decidir si el mapa carga solo tras aceptar.
- Sin analítica ni cookies propias.

## Antes de pasar de demo a web real

- Quitar `noindex, nofollow` de `index.html` y `legal.html`. El SEO pedido (título,
  descripción, JSON-LD) está puesto, pero no actúa mientras siga el `noindex`.
- Añadir al JSON-LD `url` e `image` cuando haya dominio. No se han puesto porque
  aún no existe.
- La cifra "5,0 de 5 con 15 reseñas" es de la fecha del brief: actualizarla.
- Reseñas citadas literalmente, con sus erratas ("volvere!!!"), como pide el
  brief. Pedir permiso o enlazar a la ficha cuando se tenga el enlace.
- No publicar la raíz del repositorio tal cual: `negocio.md` y `NOTAS.md` son
  internos y mencionan a otro negocio.

## Verificación de la demo (`demo-v1`)

Medido en Chrome y en WebKit de Playwright a 360, 390, 768 y 1280 px, y con
perfiles de iPhone SE y iPhone 14 (vertical y horizontal) en WebKit.

**Límite importante:** WebKit en Windows es el motor de Safari, pero **no es
Safari de un iPhone real**. Falta probar en un iPhone:

- Llamar con el botón `tel:` y que Instagram abra la app.
- Deslizar carriles y visor con el dedo: el dedo real solo se ha probado en
  Chrome con eventos táctiles simulados. En WebKit, el visor con toques y el
  contador moviendo la pista por código.
- Que se vean en negrita los botones y títulos en Onest. En el WebKit de Windows
  salen en peso normal; parece limitación de esa versión con fuentes variables.
- La barra de Safari al subir y bajar, con la cabecera fija y el visor abierto.

## Fuera de la demo: lista para la reunión

Es parte de la venta. No construir sin que compre.

- Logo propio y fotos de calidad, con una sesión en el local.
- Página sobre el Domi y su historia.
- Página propia de Trenzas con Caro.
- Carta de servicios con precios.
- Cita en línea.
- Más reseñas, enlazadas con Google.
- Versión en euskera.
