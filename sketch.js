let pos;
let bList;
let r, s, sList;
let diameter, maxDiameter;
let alpha;
let change;

function setup() {
  //handling canvas size
  scaleCanvas();
  
  // get positions of blotches
  pos = [];
  for (let a=0, n=(width-50-20)/50; a<n; a++) {
    pos.push(a*50+50-width/2);
  }
  
  // draw blotches
  bList = [];
  for (let i=0, n=pos.length;i<n;i++) {
    for (let j=0;j<n; j++) {
      let b = new Blotch(pos[i], pos[j]);
      bList.push(b);
    }
  }
  for (let p=0;p<bList.length;p++) {
    bList[p].drawing();
  }
  
  r = 0;
  sList = [];
  
  diameter = 27; maxDiameter = 60;
  alpha = 0;
  change = 0;

  angleMode(DEGREES);
}

function draw() {
  let prevWidth = width;

  // handling canvas size
  scaleCanvas();

  // changing size and distance of blotches
  for (let i=0, n=bList.length; i<n; i++) {
    bList[i].x *= width / prevWidth;
    bList[i].y *= width / prevWidth;
    bList[i].change(diameter);
  }  

  push();
  // shift origin to centre
  translate(width/2, height/2);

  push();
  //rotation and scaling of visuals
  r += s < 0 ? -0.05 : 0.05;
  s = r / 200 - 0.6;
  rotate(r);
  scale(s);

  // move blotches
  for (let p=0;p<bList.length;p++) {
    bList[p].jiggle();
  }
  pop();

  // draw sineCircle
  sineCircle();
  pop();

  // overlay for scrolling
  overlay();
}

function mouseWheel(event) {
  // setting diameter, rotation, scale, and opacity of overlay based on scroll
  diameter = abs(diameter) < maxDiameter ? diameter + event.deltaY/5 : -Math.sign(diameter) * (maxDiameter - 0.01);
  r -= event.deltaX/10;
  s -= s/abs(s) * event.deltaX/20;
  alpha = alpha < 170 ? alpha+3 : 170;
}

function scaleCanvas() {
  // scale canvas to square
  let _width = windowWidth, _height = windowHeight;
  if (_width>_height) _width = _height;
  else _height = _width;
  createCanvas(_width, _height);
  background(220);
}

function overlay() {
  fill(200, 60-alpha*1.5, 60-alpha*1.5, alpha);
  noStroke();
  rect(0, 0, width, height);
  alpha = alpha > 0 ? (alpha-1)/1.2 : 0;

  if (alpha > 0) {
    fill(200, 60-alpha*1.5, 60-alpha*1.5, alpha*3);
    rect(width*7/8, height*3/4, width/13, height/13*2, 20);
    fill(200, 60-alpha*1.5, 60-alpha*1.5, alpha*3);
    rect(width*7/8, height*3/4 + width/13, width/13, ((diameter))*width/13/60, 0, 0, 20, 20);
  }
  console.log(alpha);
}

function sineCircle() {
  push();

  sList.push(s);
  if (sList.length > 30) {
    sList.shift();
  }

  scale(sList[0]);

  let radius = width*6/11;

  fill('#cb2e3114');

  beginShape();
  for (let i=0; i<=360; i++) {
    let l = radius + radius/11 + 10*sin(i*15 + change);
    let x = l * cos(i);
    let y = l * sin(i);
    curveVertex(x, y);
  }
  endShape(CLOSE);

  beginShape();
  for (let i=0; i<=360; i++) {
    let l = radius + 35*sin(i*6 + change*2+180);
    let x = l * cos(i);
    let y = l * sin(i);
    curveVertex(x, y);
  }
  endShape(CLOSE);

  beginShape();
  for (let i=0; i<=360; i++) {
    let l = radius + radius/15 + 15*sin(i*9 + change*1.5+120);
    let x = l * cos(i);
    let y = l * sin(i);
    curveVertex(x, y);
  }
  endShape(CLOSE);

  change += s < 0 ? -1.5 : 1.5;

  pop();
}