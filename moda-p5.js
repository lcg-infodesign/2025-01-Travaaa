// moda-p5.js
let valori;
let modaArr = [];
let modaMax = 0;
let modaMin = 0;
let modaRadiusMax = 100;
let modaRadiusMin = 32;

function preload() {
  valori = loadTable('dataset.csv', 'csv', 'header');
}

function setup() {
  createCanvas(1400, 900).parent('grafico-moda');
  background('#001136');
  textAlign(CENTER, CENTER);
  textSize(28);
  fill('#fff');
  if (!valori || valori.getRowCount() === 0) {
    text('Nessun dato trovato', width/2, height/2);
    noLoop();
    return;
  }
  // Filtra secondo le regole
  let modaMap = {};
  for (let i = 0; i < valori.getRowCount(); i++) {
    let col2 = float(valori.get(i, 2));
    let col3 = float(valori.get(i, 3));
    if (col2 < 0 && col3 % 3 === 0) {
      let v2 = valori.get(i, 2); // usa la colonna 2 (terza colonna)
      if (modaMap[v2] === undefined) modaMap[v2] = 0;
      modaMap[v2]++;
    }
  }
  modaArr = Object.entries(modaMap).map(([val, freq]) => ({val: parseFloat(val), freq: freq}));
  modaArr.sort((a, b) => a.val - b.val);
  modaMax = Math.max(...modaArr.map(m => m.freq));
  modaMin = Math.min(...modaArr.map(m => m.freq));
}

function draw() {
  // Valori richiesti per hover e asse
  // In italiano
  const specialVals = [-73, -40];
  background('#001136');
  textAlign(CENTER, CENTER);
  textSize(44);
  fill('#ffb347');
  let margin = 400;
  let axisTop = 120;
  let axisBottom = height - 120;
  stroke('#b3c6e7');
  strokeWeight(2);
  line(margin, axisTop, margin, axisBottom);
  let vals = modaArr.map(m => m.val);
  let minModa = Math.min(...vals);
  let maxModa = Math.max(...vals);
  noStroke();
  fill('#b3c6e7');
  textAlign(RIGHT, CENTER);
  textSize(28);
  text(maxModa, margin-10, axisTop);
  text(minModa, margin-10, axisBottom);
  textSize(28);
  for (let v of specialVals) {
    if (v >= minModa && v <= maxModa) {
      let yv = map(v, minModa, maxModa, axisBottom, axisTop);
      fill('#ffb347');
      text(v, margin-10, yv);
    }
  }
  let xPallino = margin + 250;
  let rModa = modaRadiusMax;
  // Disegna tutti i pallini normali (tranne -73 e -40)
  for (let i = 0; i < modaArr.length; i++) {
    let m = modaArr[i];
    let y = map(m.val, minModa, maxModa, axisBottom, axisTop);
    let r;
    if (m.val === -73 || m.val === -40) {
      continue;
    }
    r = map(m.freq, modaMin, modaMax, modaRadiusMin, modaRadiusMax);
    fill(255, 179, 71, 180); // #ffb347 con alpha
    noStroke();
    ellipse(xPallino, y, r, r);
  }
  // Disegna i due pallini grandi in primo piano
  for (let i = 0; i < modaArr.length; i++) {
    let m = modaArr[i];
    if (m.val !== -73 && m.val !== -40) continue;
    let y = map(m.val, minModa, maxModa, axisBottom, axisTop);
    let r = rModa;
    fill(255, 179, 71, 255); // opaco in primo piano
    noStroke();
    ellipse(xPallino, y, r, r);
    // Scritta visibile solo al passaggio del mouse
    if (dist(mouseX, mouseY, xPallino, y) < r/2) {
      fill('#fff');
      textSize(34);
      textAlign(CENTER, CENTER);
      text(m.val, xPallino, y);
    }
  }
}
