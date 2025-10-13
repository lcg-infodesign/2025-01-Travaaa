
// Funzione per calcolare la media di un array di numeri
function mean(arr) {
    let sum = arr.reduce((a, b) => a + b, 0);
    return sum / arr.length;
}

// Funzione per calcolare la deviazione standard di un array di numeri
function stddev(arr) {
    let m = mean(arr);
    let variance = arr.reduce((a, b) => a + Math.pow(b - m, 2), 0) / arr.length;
    return Math.sqrt(variance);
}

// Funzione per calcolare la moda di un array di numeri
function mode(arr) {
    let freq = {};
    arr.forEach(v => freq[v] = (freq[v] || 0) + 1);
    let maxFreq = Math.max(...Object.values(freq));
    let modes = Object.keys(freq).filter(k => freq[k] == maxFreq);
    return modes.length === 1 ? Number(modes[0]) : modes.map(Number);
}

// Funzione per calcolare la mediana di un array di numeri
function median(arr) {
    let sorted = arr.slice().sort((a, b) => a - b);
    let mid = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 0) {
        return (sorted[mid - 1] + sorted[mid]) / 2;
    } else {
        return sorted[mid];
    }
}


function parseRule(rule) {
    rule = rule.trim();
    if (rule.includes('multiple of')) {
        const match = rule.match(/(\w+) multiple of ([-]?\d+)/);
        if (match) {
            const col = match[1];
            const n = Number(match[2]);
            return row => Number(row[col]) % n === 0;
        }
    } else {
        const match = rule.match(/(\w+)\s*([<>=!]+)\s*([-]?\d+)/);
        if (match) {
            const col = match[1];
            const op = match[2];
            const n = Number(match[3]);
            return row => {
                const v = Number(row[col]);
                switch(op) {
                    case '<': return v < n;
                    case '>': return v > n;
                    case '<=': return v <= n;
                    case '>=': return v >= n;
                    case '==': return v == n;
                    case '!=': return v != n;
                    default: return false;
                }
            };
        }
    }
    return () => true;
}


// Caricamento dati per p5.js
function preload() {
    table = loadTable("dataset.csv", "csv", "header");
    rules = loadStrings("rules.txt");
}

function setup() {
    noCanvas();
    let ruleFns = rules.map(parseRule);
    let filteredRows = [];
    for (let i = 0; i < table.getRowCount(); i++) {
        let row = table.getRow(i);
        let obj = {};
        for (let col of table.columns) {
            obj[col] = row.get(col);
        }
        let valid = ruleFns.every(fn => fn(obj));
        if (valid) filteredRows.push(obj);
    }

    // Calcolo statistiche
    const colNames = ["column0", "column1", "column2", "column3", "column4"];
    const columns = colNames.map(col => filteredRows.map(r => Number(r[col])));
    const stats = [
        { label: "Media prima colonna", value: mean(columns[0]).toFixed(2) },
        { label: "Deviazione standard seconda colonna", value: stddev(columns[1]).toFixed(2) },
        { label: "Moda terza colonna", value: Array.isArray(mode(columns[2])) ? mode(columns[2]).join(", ") : mode(columns[2]) },
        { label: "Mediana quarta colonna", value: median(columns[3]) },
        { label: "Media quinta colonna", value: mean(columns[4]).toFixed(2) },
        { label: "Deviazione standard quinta colonna", value: stddev(columns[4]).toFixed(2) }
    ];

    // Statistiche testuali
    let statsHtml = `<div class="stats">
        <h2>Statistiche</h2>
        <ul>
            ${stats.map(s => `<li><b>${s.label}:</b> ${s.value}</li>`).join("\n")}
        </ul>
    </div>`;

    // Tabella dati filtrati
    const output = document.getElementById('output');
    if (output) {
        if (filteredRows.length === 0) {
            output.innerHTML = statsHtml + '<p>Nessuna riga valida trovata.</p>';
        } else {
            let html = '<table><thead><tr>';
            for (let col of table.columns) {
                html += `<th>${col}</th>`;
            }
            html += '</tr></thead><tbody>';
            for (let row of filteredRows) {
                html += '<tr>';
                for (let col of table.columns) {
                    html += `<td>${row[col]}</td>`;
                }
                html += '</tr>';
            }
            html += '</tbody></table>';
            output.innerHTML = statsHtml + html;
        }
    }
}

// SCRIPT PER FILTRARE E VISUALIZZARE UN DATASET CSV SECONDO LE REGOLE DI UN FILE DI TESTO


// ...existing code...

// let table;      // (RIMOSSO: già dichiarato sopra per p5.js)
let rules = []; // Qui verranno caricate le regole dal file di testo (array)

// Variabili globali per le statistiche (per p5.js draw)
let stats = [];
let columns = [];

// Questa funzione prende una regola in formato testo e la trasforma in una funzione che verifica se una riga la rispetta
function parseRule(rule) {
    rule = rule.trim(); // Rimuove spazi inutili

    // Se la regola contiene "multiple of", la gestiamo qui
    if (rule.includes('multiple of')) {
        // Regola: "column3 multiple of 3"
        const match = rule.match(/(\w+) multiple of ([-]?\d+)/);
        if (match) {
            const col = match[1]; // Nome della colonna
            const n = Number(match[2]); // Numero di cui deve essere multiplo
            // Restituisce una funzione che controlla se il valore della colonna è multiplo di n
            return row => Number(row[col]) % n === 0;
        }
    } else {
        // Gestisce regole come "column2 < 0", ecc.
        const match = rule.match(/(\w+)\s*([<>=!]+)\s*([-]?\d+)/);
        if (match) {
            const col = match[1]; // Nome della colonna
            const op = match[2];  // Operatore (es: <, >, ==, ...)
            const n = Number(match[3]); // Numero con cui confrontare
            // Restituisce una funzione che applica l'operatore tra il valore della colonna e il numero
            return row => {
                const v = Number(row[col]);
                switch(op) {
                    case '<': return v < n;
                    case '>': return v > n;
                    case '<=': return v <= n;
                    case '>=': return v >= n;
                    case '==': return v == n;
                    case '!=': return v != n;
                    default: return false; // Operatore non riconosciuto
                }
            };
        }
    }
    // Se la regola non è riconosciuta, la ignora (non filtra nulla)
    return () => true;
}

// Questa funzione viene chiamata PRIMA di tutto il resto: carica i dati dal CSV e le regole dal file di testo
function preload() {
    table = loadTable("dataset.csv", "csv", "header"); // Carica il file CSV come tabella
    rules = loadStrings("rules.txt");                    // Carica ogni riga di rules.txt come stringa
}

// Questa funzione viene chiamata DOPO preload: filtra i dati e li mostra nella pagina
function setup() {
    // --- GESTIONE DATI E STATISTICHE ---
    // Trasforma ogni regola in una funzione di filtro
    let ruleFns = rules.map(parseRule);
    let filteredRows = [];
    for (let i = 0; i < table.getRowCount(); i++) {
        let row = table.getRow(i);
        let obj = {};
        for (let col of table.columns) {
            obj[col] = row.get(col);
        }
        let valid = ruleFns.every(fn => fn(obj));
        if (valid) filteredRows.push(obj);
    }
    const colNames = ["column0", "column1", "column2", "column3", "column4"];
    columns = colNames.map(col => filteredRows.map(r => Number(r[col])));
    stats = [
        { label: "Media prima colonna", value: mean(columns[0]).toFixed(2) },
        { label: "Deviazione standard seconda colonna", value: stddev(columns[1]).toFixed(2) },
        { label: "Moda terza colonna", value: Array.isArray(mode(columns[2])) ? mode(columns[2]).join(", ") : mode(columns[2]) },
        { label: "Mediana quarta colonna", value: median(columns[3]) },
        { label: "Media quinta colonna", value: mean(columns[4]).toFixed(2) },
        { label: "Deviazione standard quinta colonna", value: stddev(columns[4]).toFixed(2) }
    ];

    // --- AVVIO ANIMAZIONE MEDIA PRIMA COLONNA ---
    if (columns[0] && columns[0].length > 0) {
        setupMeanVisualization(columns[0], mean(columns[0]));
    }

    // --- (eventuale) OUTPUT HTML STATISTICHE ---
    // ...existing code...
}

function setup() {
    createCanvas(400, 200).parent('grafico'); // crea il canvas nel div
    background(30, 30, 80); // colore di sfondo
}

function draw() {
    fill(255, 100, 100);
    ellipse(frameCount % width, height/2, 50, 50); // esempio di animazione
}