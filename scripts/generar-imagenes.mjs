// Genera en img/ las versiones reducidas y recortadas de las fotos.
// Nunca toca imagenes/ ni amplía una foto. Hay que tener sharp disponible.
// Uso: node scripts/generar-imagenes.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const entrada = path.join(raiz, 'imagenes');
const salida = path.join(raiz, 'img');
fs.mkdirSync(salida, { recursive: true });

// sharp no es dependencia de la web: se indica su ubicación con SHARP_DIR.
const require = createRequire(path.join(process.env.SHARP_DIR || raiz, 'x.js'));
const sharp = require('sharp');

// Recortes: quitan de la capa el rótulo "BARBER SHOP / SINCE 2019" de la marca.
const recortes = {
  'degradado-3': { left: 0, top: 0, width: 415, height: 370 },
  'trenzas-3': { left: 120, top: 0, width: 780, height: 560 },
  'trenzas-4': { left: 100, top: 240, width: 600, height: 500 },
  'trenzas-5': { left: 0, top: 0, width: 752, height: 1050 },
};
const anchos = [360, 560, 752];
const fotos = ['degradado-1', 'degradado-2', 'degradado-3', 'degradado-4', 'diseno-1', 'diseno-2', 'diseno-3',
  'trenzas-1', 'trenzas-2', 'trenzas-3', 'trenzas-4', 'trenzas-5', 'barbero-1'];

for (const foto of fotos) {
  const origen = path.join(entrada, `${foto}.webp`);
  const recorte = recortes[foto];
  const { width } = recorte ?? await sharp(origen).metadata();
  // Anchos menores que el real, más el propio ancho real de la foto o el recorte.
  const lista = [...anchos.filter((a) => a < width), width];
  for (const ancho of lista) {
    let img = sharp(origen);
    if (recorte) img = img.extract(recorte);
    const destino = path.join(salida, `${foto}-${ancho}.webp`);
    const info = await img.resize({ width: ancho, withoutEnlargement: true }).webp({ quality: 78 }).toFile(destino);
    console.log(path.basename(destino), info.width, info.height, Math.round(info.size / 1024) + ' KB');
  }
}
