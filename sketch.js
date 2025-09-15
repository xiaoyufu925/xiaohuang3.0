
let video;
let targetColor;
let flowers = [];
let bloomParticles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);

  let constraints = {
    video: {
      facingMode: { exact: "environment" }
    },
    audio: false
  };

  video = createCapture(constraints, () => {
    console.log("📷 后置摄像头已启动");
  });

  video.size(width, height);
  video.hide();
  targetColor = color(255, 255, 0);
}

function draw() {
  background(0);
  image(video, 0, 0, width, height);
  video.loadPixels();

  flowers = [];

  for (let y = 0; y < video.height; y += 10) {
    for (let x = 0; x < video.width; x += 10) {
      let index = (x + y * video.width) * 4;
      let r = video.pixels[index];
      let g = video.pixels[index + 1];
      let b = video.pixels[index + 2];

      let d = dist(r, g, b, 255, 255, 0);
      if (d < 80 && r > 200 && g > 200 && b < 100) {
        let screenX = map(x, 0, video.width, 0, width);
        let screenY = map(y, 0, video.height, 0, height);
        flowers.push({ x: screenX, y: screenY, size: 80 });
      }
    }
  }

  for (let f of flowers) {
    drawFlatFlower(f.x, f.y, f.size);
  }

  for (let i = bloomParticles.length - 1; i >= 0; i--) {
    let p = bloomParticles[i];
    p.update();
    p.show();
    if (p.isFinished()) {
      bloomParticles.splice(i, 1);
    }
  }
}

function drawFlatFlower(x, y, size) {
  push();
  translate(x, y);
  noStroke();
  fill(255, 204, 0);
  for (let i = 0; i < 5; i++) {
    let angle = TWO_PI / 5 * i;
    let px = cos(angle) * size * 0.5;
    let py = sin(angle) * size * 0.5;
    ellipse(px, py, size * 0.5, size * 0.3);
  }
  fill(255, 150, 0);
  ellipse(0, 0, size * 0.4);
  pop();
}

function mousePressed() {
  for (let i = 0; i < 10; i++) {
    bloomParticles.push(new BloomParticle(mouseX, mouseY));
  }
}

class BloomParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = random(12, 18);
    this.angle = random(TWO_PI);
    this.speed = random(1.5, 3);
    this.alpha = 255;
  }

  update() {
    this.x += cos(this.angle) * this.speed;
    this.y += sin(this.angle) * this.speed;
    this.alpha -= 4;
  }

  show() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    noStroke();
    fill(255, 204, 0, this.alpha);
    ellipse(0, 0, this.r * 1.2, this.r);  // 扁平化椭圆瓣
    pop();
  }

  isFinished() {
    return this.alpha <= 0;
  }
}
