let pattern;
let currentPaletteIndex = 0;

let palettes = [
  [
    '#1c1412',
    '#1c1412',
    '#e76f51',
    '#f4a261',
    '#e9c46a',
    '#2a9d8f',
    '#264653',
    '#f8f1e5'
  ],
  [
    '#090d16',
    '#090d16',
    '#845ec2',
    '#d65db1',
    '#d65db1',
    '#ff9671',
    '#ffc75f',
    '#f9f871'
  ]
];

function setup() {
  createCanvas(500, 500);
  angleMode(DEGREES);
  noLoop(); 
  let body=select('body');
  body.style('background-image', "url(./assets/background.jpg)")
  body.style('background-size', "cover");
  body.style('background-position', "center");
  body.style('background-repeat', "no-repeat");
  body.style('background-attachment', "fixed");
  
  
  

  let names = ['Generate:Complementary', 'Generate:Analogous'];

  for (let i = 0; i < 2; i++) {
    let btn = createButton(names[i]);
    btn.position(20, 45 + i * 40);
    btn.style('background', '#f5a315');
    btn.style('color', '#f8f1e5');
    btn.style('border', '1px solid #6b5b52');
    btn.style('padding', '8px 12px');
    btn.style('border-radius', '4px');
    btn.style('cursor', 'pointer');
    btn.style('font-family', 'sans-serif');
    btn.style('font-weight', 'bold');
    
    btn.mousePressed(() => {
      currentPaletteIndex = i;
      pattern = random(99999);
      redraw();
    });
  }

  let saveBtn=createButton('Download')
    saveBtn.position(20,135);
    saveBtn.style('background', '#e76f51');
    saveBtn.style('color', '#f8f1e5');
    saveBtn.style('border', '1px solid #1c1412');
    saveBtn.style('padding', '8px 12px');
    saveBtn.style('border-radius', '4px');
    saveBtn.style('cursor', 'pointer');
    saveBtn.style('font-family', 'sans-serif');
    saveBtn.style('font-weight', 'bold');
    saveBtn.style('width', '90px');

  saveBtn.mousePressed(() => {
    saveCanvas('superSecretThing_' + floor(pattern), 'png');
  });

  
  pattern = random(99999);
}

function draw() {
  let activePalette = palettes[currentPaletteIndex];
  background(activePalette[1]); 
  randomSeed(pattern);
  
  translate(width / 2, height / 2); 
  
  let layers = floor(random(6, 10));     
  let symmetry = floor(random(4, 8)) * 2; 
  
  stroke(activePalette[0]); 
  strokeWeight(1.25);
  for (let a = 0; a < 360; a += 360 / (symmetry * 4)) {
    line(0, 0, cos(a) * (width * 0.45), sin(a) * (width * 0.45));
  }
  for (let r = 50; r < width * 0.45; r += 50) {
    noFill();
    ellipse(0, 0, r * 2);
  }

  for (let i = layers; i > 0; i--) {
    push();
    
    let radius = i * random(20, 20); 
    let rotations = [0, 360 / (symmetry * 2)];
    rotate(random(rotations));
    
    let artColors = [activePalette[2], activePalette[3], activePalette[4], activePalette[5], activePalette[6], activePalette[7]];
    let primaryColor = color(random(artColors));
    let secondaryColor = color(random(artColors));
    
    stroke(primaryColor);
    strokeWeight(random([1, 1.75, 2.5]));
    
    let points = [];
    for (let a = 0; a < 360; a += 360 / symmetry) {
      let x = radius * cos(a);
      let y = radius * sin(a);
      points.push({x: x, y: y, angle: a});
    }

    let geometryType = floor(random(6));
    
    if (geometryType === 0) {
      for (let j = 0; j < points.length; j++) {
        let nextIndex = (j + 1) % points.length;
        
        if (random() > 0.2) {
          fill(random([activePalette[2], activePalette[3], activePalette[5], activePalette[6]]));
        } else {
          fill(activePalette[1]); 
        }
        
        beginShape();
        vertex(0, 0);
        vertex(points[j].x, points[j].y);
        vertex(points[nextIndex].x, points[nextIndex].y);
        endShape(CLOSE);
      }
      
    } else if (geometryType === 1) {
      let fillChoiceColor = random(artColors);
      
      for (let j = 0; j < points.length; j++) {
        let nextIndex = (j + 1) % points.length;
        let innerRad = radius * 0.5;
        let xInner = innerRad * cos(points[j].angle + (360 / (symmetry * 2)));
        let yInner = innerRad * sin(points[j].angle + (360 / (symmetry * 2)));
        
        if (j % 2 === 0) {
          fill(fillChoiceColor);
        } else {
          noFill();
        }
        
        beginShape();
        vertex(points[j].x, points[j].y);
        vertex(xInner, yInner);
        vertex(points[nextIndex].x, points[nextIndex].y);
        endShape(CLOSE);
      }
      
    } else if (geometryType === 2) {
      fill(activePalette[1]); 
      if (random() > 0.5) fill(activePalette[0]); 
      
      beginShape();
      for (let p of points) {
        vertex(p.x, p.y);
      }
      endShape(CLOSE);
      
      for (let p of points) {
        stroke(secondaryColor);
        strokeWeight(1.25);
        line(p.x, p.y, p.x * 1.12, p.y * 1.12);
        
        push();
        translate(p.x * 1.12, p.y * 1.12);
        rotate(p.angle + 45);
        fill(primaryColor); 
        rectMode(CENTER);
        rect(0, 0, 6, 6); 
        pop();
      }
      
    } else {
      connectAllPoints(points, primaryColor, 0.75);
    }
    
    if (random() > 0.3) {
      stroke(secondaryColor);
      strokeWeight(3); 
      for (let a = 0; a < 360; a += 360 / (symmetry * 2)) {
        let dotRad = radius - 10;
        if (dotRad > 0) {
          point(dotRad * cos(a), dotRad * sin(a));
        }
      }
    }

    pop();
  }
}

function connectAllPoints(pts, col, wt) {
  push();
  let alphaCol = color(col);
  alphaCol.setAlpha(40); 
  stroke(alphaCol);
  strokeWeight(wt);
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      line(pts[i].x, pts[i].y, pts[j].x, pts[j].y);
    }
  }
  pop();
}
