let data;

function preload() {
         data = loadTable("data/Stars.csv", "csv", "header");
}

function colorMap(name) { //trasforma nome a colore corrispondente
         switch (name) {
                  case "red": return [255, 80, 80];
                  case "orange": return [255, 160, 80];
                  case "yellow": return [255, 255, 100];
                  case "white": return [255, 255, 255];
                  case "blue": return [100, 150, 255];
                  case "blue-white": return [180, 200, 255];
                  case "yellow-white": return [255, 250, 210];
                  default: return [180, 180, 180]; // fallback neutro
         }
}

function setup() {
         let canvas = createCanvas(windowWidth * 0.9, windowHeight);
         canvas.parent("sketchDettaglio");

         //gli chiedo di leggere i parametri della fonte
         let params = getURLParams();

         // Cerca la riga che corrisponde alla magnitudine ass.
         // e prendi la prima corrispondenza trovata
         let selected = data.findRows(params.AM, "A_M")[0];

         //riprendiamo i dati che ci interessano di questa stella in particolare
         let R = float(selected.get("R"));
         let L = float(selected.get("L"));
         let allR = data.getColumn("R").map(Number); //recupero anche il generale per mettere i valori in scala
         minR = min(allR);
         maxR = max(allR);
         let allL = data.getColumn("L").map(Number);
         minL = min(allL);
         maxL = max(allL);

         let globalValues = allR.concat(allL);
         let minGlobal = min(globalValues);
         let maxGlobal = max(globalValues);

         //dimensioni limite della circonferenza
         let maxRadius = 300;
         let minRadius = 50;

         //colori 
         let colorName = selected.get("Color").trim().toLowerCase().replace(/\s+/g, "-");
         let starColor = colorMap(colorName);

         //========= disegniamo la stella =================
         push();
         translate(width / 2, height / 2); //posiziono al centro del canvas

         //luminosità stella
         let luminStar = map(log(L), log(minGlobal), log(maxGlobal), minRadius, maxRadius);
         push();
         noStroke();
         fill(starColor[0], starColor[1], starColor[2], 120);
         ellipse(0, 0, luminStar, luminStar);
         pop();

         //raggio stella
         let radiusStar = map(log(R), log(minGlobal), log(maxGlobal), minRadius, maxRadius);
         push();
         strokeWeight(2);
         stroke(starColor[0], starColor[1], starColor[2]);
         noFill();
         ellipse(0, 0, radiusStar, radiusStar);
         pop();

         //============ confrontiamo stella Sole (R e L =1) =============

         //sole
         let radiusSun = map(log(1), log(minGlobal), log(maxGlobal), minRadius, maxRadius);
         push();
         strokeWeight(2);
         stroke(255);
         fill(225, 120);
         ellipse(0, 0, radiusSun, radiusSun);
         pop();
         pop();

}

function draw() {
}