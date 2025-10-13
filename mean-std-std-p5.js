let valoriStd;
function preload() {
  valoriStd = loadTable('dataset.csv', 'csv', 'header');
}
let pallineStd = [];
let mediaStd = 0;
let stdDev = 0;
let showStdRect = true;
function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent('grafico-std');
  background('#001136');
  textAlign(CENTER, CENTER);
  textSize(16);
  fill('#fff');
  if (!valoriStd || valoriStd.getRowCount() === 0) {
    text('Nessun dato trovato', width/2, height/2);
    noLoop();
    return;
  }
  let dati = [];
  for (let i = 0; i < valoriStd.getRowCount(); i++) {
    let col2 = float(valoriStd.get(i, 2));
    let col3 = float(valoriStd.get(i, 3));
    if (col2 < 0 && col3 % 3 === 0) {
      let v = float(valoriStd.get(i, 4));
      if (!isNaN(v)) dati.push(v);
    }
  }

  mediaStd = dati.reduce((a, b) => a + b, 0) / dati.length;
  stdDev = sqrt(dati.reduce((acc, v) => acc + pow(v - mediaStd, 2), 0) / dati.length);
  let minV = Math.min(...dati);
  let maxV = Math.max(...dati);
  let margin = 60;
  let axisTop = 30;
  let axisBottom = height - 30;
  for (let i = 0; i < dati.length; i++) {
    let x = map(i, 0, dati.length-1, margin, width-margin);
    let y = map(dati[i], minV, maxV, axisBottom, axisTop);
    let targetY = map(mediaStd, minV, maxV, axisBottom, axisTop);
    pallineStd.push({x, y, targetY, valore: dati[i], colore: color(100, 180, 255, 200)});
  }
  window._minV_std = minV;
  window._maxV_std = maxV;
  window._margin_std = margin;
  window._axisTop_std = axisTop;
  window._axisBottom_std = axisBottom;
  animazioneAttivaStd = false;

}
function draw() {
  background('#001136');
  let margin = window._margin_std || 60;
  let minV = window._minV_std;
  let maxV = window._maxV_std;
  let axisTop = window._axisTop_std || 30;
  let axisBottom = window._axisBottom_std || (height-30);
  stroke('#b3c6e7');
  strokeWeight(2);
  line(margin, axisTop, margin, axisBottom);
  noStroke();
  fill('#b3c6e7');
  textAlign(RIGHT, CENTER);
  textSize(13);
  text(nf(maxV, 1, 2), margin-8, axisTop);
  text(nf(minV, 1, 2), margin-8, axisBottom);
  if (minV < 0 && maxV > 0) {
    let yZero = map(0, minV, maxV, axisBottom, axisTop);
    text('0', margin-8, yZero);
  }
  let yMedia = pallineStd.length > 0 ? pallineStd[0].targetY : height/2;
  let yStdUp = map(mediaStd + stdDev, minV, maxV, axisBottom, axisTop);
  let yStdDown = map(mediaStd - stdDev, minV, maxV, axisBottom, axisTop);
  if (showStdRect) {
    noStroke();
    fill(100, 180, 255, 60);
    rect(margin, yStdUp, width-2*margin, yStdDown-yStdUp);
  }
  stroke('#ffb347');
  strokeWeight(2);
  line(margin, yMedia, width-margin, yMedia);
  noStroke();
  // scritta Mean
  fill('#64b6ff');
  textAlign(LEFT, CENTER);
  text('Mean: ' + nf(mediaStd, 1, 2), width - margin - 60, yMedia + 30);
  // scritta Standard deviation
  fill('#ffb347');
  textAlign(RIGHT, TOP);
  text('Standard deviation: ' + nf(stdDev, 1, 2), width - margin, axisTop);
  for (let p of pallineStd) {
    fill(p.colore);
    ellipse(p.x, p.y, 28, 28);
    stroke(100, 180, 255, 80);
    line(p.x, p.y, margin, p.y);
    noStroke();
  }
}
