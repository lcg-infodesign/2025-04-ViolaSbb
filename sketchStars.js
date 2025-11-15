let data;
let infobox;
let hoveredStar = null;

function preload() {
         data = loadTable("data/Stars.csv", "csv", "header");
}

function setup() {
         let canvas = createCanvas(windowWidth * 0.9, windowHeight);
         canvas.parent("sketch"); //collegamento posizione in html

         //ricavo i dati
         let allTemp = data.getColumn("Temperature").map(Number);
         let allL = data.getColumn("L").map(Number); //specifico che sto ricavando dei numeri
         let allR = data.getColumn("R").map(Number);
         let allAM = data.getColumn("A_M").map(Number);

         //definisco min e max
         minTemp = min(allTemp);
         maxTemp = max(allTemp);
         minL = min(allL);
         maxL = max(allL);
         minR = min(allR);
         maxR = max(allR);
         minAM = min(allAM);
         maxAM = max(allAM);

         //dichiaro infobox
         infobox = select("#infobox");
         infobox.style("opacity", 0);
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



function draw() {
         //sistemo il canvas
         background(12, 12, 23);
         let hovered = false; //serve per la card dopo
         let marginLeft = 50;
         let marginRight = 50;
         let marginTop = 40;
         let marginBottom = 60;

         //disegno gli assi x e y
         push();
         stroke(255);
         line(marginLeft, height - marginBottom, width - marginRight, height - marginBottom);
         line(marginLeft, height - marginBottom, marginLeft, marginTop);
         pop();

         //disegno un glifo PER ogni riga di dato
         for (let row = 0; row < data.getRowCount(); row++) {
                  //ricava temp e L per ogni dato
                  let temp = data.getNum(row, "Temperature");
                  let l = data.getNum(row, "L");
                  let r = data.getNum(row, "R");
                  let colorName = data.getString(row, "Color").trim().toLowerCase().replace(/\s+/g, "-"); //trim toglie spazi extra, tolowercase fa tutto minuscolo, replace cambia spazio con -
                  let AM = data.getNum(row, "A_M"); //Magnitudine assoluta, cioè la luminosità reale osservata se la stella fosse a 10 parsec dalla Terra.

                  //assegno posizione stelle
                  let x = map(log(l), log(minL), log(maxL), marginLeft, width - marginRight); //in scala logaritmica così sono un po' più sparse
                  let y = map(log(temp + 1), log(minTemp + 1), log(maxTemp + 1), height - marginBottom, marginTop);
                  let radius = map(r, minR, maxR, 10, 50);
                  let starColor = colorMap(colorName);
                  let absMagn = map(AM, maxAM, minAM, 10, 50); //Valori più bassi, stella più brillante.

                  //hover
                  let d = dist(x, y, mouseX, mouseY);
                  let isHovered = d < radius / 1.5;

                  if (isHovered) {
                           hoveredStar = {
                                    AM: AM,
                                    Temperature: temp,
                                    L: l,
                                    R: r,
                                    row: row
                           };

                           hovered = true;
                           //dati da inserire
                           let typeName = starType(data.getNum(row, "Type"));
                           select("#tipo").html(typeName);
                           select("#spettro").html(data.getString(row, "Spectral_Class"));
                           select("#temp").html(data.getNum(row, "Temperature"));
                           select("#lum").html(data.getNum(row, "L"));
                           select("#rag").html(data.getNum(row, "R"));
                           select("#magA").html(data.getNum(row, "A_M"));

                           //se troppo vicino a margine destro
                           let offsetX = 50;
                           let offsetY = 420;

                           if (x + 250 > width) offsetX = -220; //se troppo a dx vai a sx
                           if (y + 190 > height) offsetY = 350; //se troppo basso vai su

                           //box si mostra
                           infobox.position(x + offsetX, y + offsetY);
                           infobox.style("opacity", 1);
                  }

                  push();
                  noStroke();
                  if (isHovered) {
                           fill(starColor[0], starColor[1], starColor[2], 210);
                  } else {
                           fill(starColor[0], starColor[1], starColor[2], 120);
                  }
                  ellipse(x, y, absMagn);
                  pop();

                  push();
                  strokeWeight(1.5);
                  if (isHovered) {
                           stroke(starColor[0], starColor[1], starColor[2]);
                  } else {
                           stroke(5, 4, 130);
                  }
                  noFill();
                  ellipse(x, y, radius);
                  pop();
         }
         if (!hovered) hoveredStar = null;



         // etichette assi
         fill(255);
         textSize(14);
         textAlign(CENTER);
         text("Luminosità (L☉)", windowWidth / 2, height - 20);
         text("relativa al Sole →", windowWidth / 2, height);
         push();
         translate(20, height / 2);
         rotate(-HALF_PI);
         text("Temperatura (K) →", 0, 0);
         pop();
}

function mousePressed() {
         //al click creo una nuova pagina sul modello dettaglio.html che si riferisce a AM
         let newURL = "dettaglio.html?AM=" + hoveredStar.AM; //non avendo i nomi delle singole stelle, uso come parametro la magn. ass. che è unica per tutti 
         if (hoveredStar) {
                  window.location.href = newURL;
         }
}
