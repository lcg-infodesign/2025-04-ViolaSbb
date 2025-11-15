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

function starType(type) {
         switch (type) {
                  case 0: return "Nana Rossa";
                  case 1: return "Nana Bruna";
                  case 2: return "Nana Bianca";
                  case 3: return "Stella di Sequenza Principale";
                  case 4: return "Supergigante";
                  case 5: return "Ipergigante";
         }
}


function setup() {
         let canvas = createCanvas(windowWidth * 0.5, windowHeight);
         canvas.parent("sketchDettaglio");

         //gli chiedo di leggere i parametri della fonte
         let params = getURLParams();

         // Cerca la riga che corrisponde alla magnitudine ass.
         // e prendi la prima corrispondenza trovata
         let selected = data.findRows(params.AM, "A_M")[0];
         //per i dati nell'html
         let typeName = starType(int(selected.get("Type")));
         select("#tipo").html(typeName);
         select("#spettro").html(selected.get("Spectral_Class"));
         select("#temp").html(selected.get("Temperature"));
         select("#lum").html(selected.get("L"));
         select("#rag").html(selected.get("R"));
         select("#magA").html(selected.get("A_M"));

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
         let maxRadius = 800;
         let minRadius = 50;

         //colori 
         let colorName = selected.get("Color").trim().toLowerCase().replace(/\s+/g, "-");
         let starColor = colorMap(colorName);
         
         //parametro css
         document.documentElement.style.setProperty(
                  "--star-color",
                  `rgb(${starColor[0]}, ${starColor[1]}, ${starColor[2]})`
         );

         //========= disegniamo la stella =================
         push();
         translate(width / 2, height / 2); //posiziono al centro del canvas
         //============ confrontiamo stella Sole (R e L =1) =============

         //sole
         let radiusSun = map(log(1), log(minGlobal), log(maxGlobal), minRadius, maxRadius);
         push();
         strokeWeight(4);
         stroke(247, 218, 50);
         fill(247, 218, 50, 190);
         ellipse(0, 0, radiusSun, radiusSun);
         pop();

         //luminosità stella
         let luminStar = map(log(L), log(minGlobal), log(maxGlobal), minRadius, maxRadius);
         push();
         noStroke();
         fill(starColor[0], starColor[1], starColor[2], 200);
         ellipse(0, 0, luminStar, luminStar);
         pop();

         //raggio stella
         let radiusStar = map(log(R), log(minGlobal), log(maxGlobal), minRadius, maxRadius);
         push();
         strokeWeight(4);
         stroke(starColor[0], starColor[1], starColor[2]);
         noFill();
         ellipse(0, 0, radiusStar, radiusStar);
         pop();
         pop();

}

function draw() {
}

