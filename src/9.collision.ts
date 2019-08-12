import 'normalize.css';
import * as PIXI from 'pixi.js';
import scaleToWindow from './assets/js/scaleToWindow';
import keyboard from './assets/js/keyboard';
import hitTestRectangle from './assets/js/hitTestReactangle';

const redBoyJson = require('./assets/images/Boy Pixel/redBoy/redBoy.json'); // eslint-disable-line @typescript-eslint/no-var-requires
// eslint-disable-next-line @typescript-eslint/no-var-requires, import/no-dynamic-require
const redBoyImg = require(`./assets/images/Boy Pixel/redBoy/${redBoyJson.meta.image}`);

const {
  Application,
  Loader,
  Sprite,
  Spritesheet,
  Graphics,
  Text,
} = PIXI;

const app = new Application({
  antialias: true,
});

window.addEventListener('resize', (): void => {
  scaleToWindow(app.renderer.view);
});

document.body.appendChild(app.view);

app.renderer.backgroundColor = 0x061639;
app.renderer.view.style.position = 'absolute';
app.renderer.view.style.display = 'block';
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);

interface RedBoyRightI extends PIXI.Sprite {
  vx?: number;
  vy?: number;
}

let redBoyRight: RedBoyRightI;
let box: PIXI.Graphics;
let message: PIXI.Text;

const gameLoop = (delta: number): void => {
  if (redBoyRight) {
    redBoyRight.x += redBoyRight.vx;
    redBoyRight.y += redBoyRight.vy;

    if (hitTestRectangle(redBoyRight, box)) {
      box.tint = 0xff3300;
      message.text = 'hit!';
    } else {
      box.tint = 0xccff99;
      message.text = 'No collision...';
    }
  }
};

const setup = (pixiLoader: PIXI.Loader, resource: PIXI.LoaderResource): void => {
  console.log('setup');

  // box
  box = new Graphics();
  box.lineStyle(4, 0x99ccff, 1);
  box.beginFill(0xff9933);
  box.drawRoundedRect(0, 0, 84, 36, 10);
  box.endFill();
  box.position.set(150, 190);

  app.stage.addChild(box);

  // message
  message = new Text('Hello Pixi!', {
    fill: '#FFFFFF',
    stroke: '#FF3300',
    strokeThickness: 4,
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
  });
  message.position.set(250, 190);
  app.stage.addChild(message);

  // redBoy
  const sheet = new Spritesheet(resource['images/redBoy.png'].texture, redBoyJson);
  sheet.parse((spritesheet): void => {
    redBoyRight = new Sprite(spritesheet['redright.png']);
    redBoyRight.x = 50;
    redBoyRight.y = 50;
    redBoyRight.vx = 0;
    redBoyRight.vy = 0;
    app.stage.addChild(redBoyRight);
  });

  const left = keyboard(37);
  const up = keyboard(38);
  const right = keyboard(39);
  const down = keyboard(40);

  left.press = (): void => {
    redBoyRight.vx = -5;
    redBoyRight.vy = 0;
  };

  left.release = (): void => {
    if (!right.isDown && redBoyRight.vy === 0) {
      redBoyRight.vx = 0;
    }
  };

  up.press = (): void => {
    redBoyRight.vx = 0;
    redBoyRight.vy = -5;
  };

  up.release = (): void => {
    if (!down.isDown && redBoyRight.vx === 0) {
      redBoyRight.vy = 0;
    }
  };

  right.press = (): void => {
    redBoyRight.vx = 5;
    redBoyRight.vy = 0;
  };

  right.release = (): void => {
    if (!left.isDown && redBoyRight.vy === 0) {
      redBoyRight.vx = 0;
    }
  };

  down.press = (): void => {
    redBoyRight.vx = 0;
    redBoyRight.vy = 5;
  };

  down.release = (): void => {
    if (!up.isDown && redBoyRight.vx === 0) {
      redBoyRight.vy = 0;
    }
  };

  app.ticker.add((delta: number): void => gameLoop(delta));
};

const loadProgressHandler = (pixiLoader: PIXI.Loader, resource: PIXI.LoaderResource): void => {
  console.log(`loading ${resource.url}`);
  console.log(`progress ${pixiLoader.progress} %`);
};

new Loader()
  .add(redBoyImg)
  .on('progress', loadProgressHandler)
  .load(setup);
