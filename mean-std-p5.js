// mean-std-p5.js
// Visualizza i valori filtrati della quinta colonna come pallin

let valori; // Tabella CSV caricata
let palline = []; // Array di oggetti-pallina
let media = 0; // Media dei valori filtrati

// Carica il CSV prima di tutto (funzione p5.js)
function preload() {
  valori = loadTable('dataset.csv', 'csv', 'header');
}

function setup() {
  // Crea canvas
  createCanvas(800, 500).parent('grafico-meanstd');
  background('#001136');
  textAlign(CENTER, CENTER);
  textSize(16);
  fill('#fff');

  // Estrai i valori della quinta colonna SOLO se column2 < 0 e column3 multiplo di 3
  let dati = [];
  for (let i = 0; i < valori.getRowCount(); i++) {
    let col2 = float(valori.get(i, 2));
    let col3 = float(valori.get(i, 3));
    if (col2 < 0 && col3 % 3 === 0) {
      let v = float(valori.get(i, 4));
      if (!isNaN(v)) dati.push(v);
    }
  }

  // Calcola la media dei valori filtrati
  media = dati.reduce((a, b) => a + b, 0) / dati.length;

  // Normalizza i valori per la visualizzazione
  let minV = Math.min(...dati);
  let maxV = Math.max(...dati);
  let margin = 60;
  let axisTop = 30;
  let axisBottom = height - 30;

  // Crea le palline: posizione x, y iniziale, y target (media)
  for (let i = 0; i < dati.length; i++) {
    let x = map(i, 0, dati.length-1, margin, width-margin);
    let y = map(dati[i], minV, maxV, axisBottom, axisTop);
    let targetY = map(media, minV, maxV, axisBottom, axisTop);
    palline.push({x, y, targetY, valore: dati[i], colore: color(255, 180, 70, 200)});
  }

  // Salva min e max per l'asse e i limiti dell'asse (per il draw)
  window._minV = minV;
  window._maxV = maxV;
  window._margin = margin;
  window._axisTop = axisTop;
  window._axisBottom = axisBottom;
}

function draw() {
  background('#001136');

  // Asse verticale a sinistra (valori)
  let margin = window._margin || 60;
  let minV = window._minV;
  let maxV = window._maxV;
  let axisTop = window._axisTop || 30;
  let axisBottom = window._axisBottom || (height-30);
  stroke('#b3c6e7');
  strokeWeight(2);
  line(margin, axisTop, margin, axisBottom); // asse verticale

  // Etichette min/max/zero
  noStroke();
  fill('#b3c6e7');
  textAlign(RIGHT, CENTER);
  textSize(13);
  text(nf(maxV, 1, 2), margin-8, axisTop);
  text(nf(minV, 1, 2), margin-8, axisBottom);
  // Etichetta zero se compreso tra min e max
  if (minV < 0 && maxV > 0) {
    let yZero = map(0, minV, maxV, axisBottom, axisTop);
    text('0', margin-8, yZero);
  }

  // Disegna la linea della media
  stroke('#ffb347');
  strokeWeight(2);
  let yMedia = palline.length > 0 ? palline[0].targetY : height/2;
  line(margin, yMedia, width-margin, yMedia);

  // Scritta "Mean" e valore a destra del grafico
  noStroke();
  fill('#ffb347');
  textAlign(LEFT, CENTER);
  text('Mean: ' + nf(media, 1, 2), width - margin - 60, yMedia + 30);

  // Disegna le palline
  for (let p of palline) {
    fill(p.colore);
    ellipse(p.x, p.y, 28, 28);
    // Linea orizzontale dal pallino all'asse
    stroke(255, 180, 70, 80);
    line(p.x, p.y, margin, p.y);
    noStroke();
  }
}
