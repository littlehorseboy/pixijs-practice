import 'normalize.css';
import * as PIXI from 'pixi.js';
import scaleToWindow from './assets/js/scaleToWindow';

const redBoyJson = require('./assets/images/Boy Pixel/redBoy/redBoy.json'); // eslint-disable-line @typescript-eslint/no-var-requires
// eslint-disable-next-line @typescript-eslint/no-var-requires, import/no-dynamic-require
const redBoyImg = require(`./assets/images/Boy Pixel/redBoy/${redBoyJson.meta.image}`);

const {
  Application,
  Loader,
  Sprite,
  Spritesheet,
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

let redBoyRight: PIXI.Sprite;
let redBoyRightWalk1: PIXI.Sprite;
let redBoyRightWalk2: PIXI.Sprite;

const gameLoop = (delta: number): void => {

};

const setup = (pixiLoader: PIXI.Loader, resource: PIXI.LoaderResource): void => {
  console.log('setup');

  // redBoy
  const sheet = new Spritesheet(resource[redBoyImg].texture, redBoyJson);
  sheet.parse((spritesheet): void => {
    redBoyRight = new Sprite(spritesheet['redright.png']);
    redBoyRight.position.set(50, 50);

    redBoyRightWalk1 = new Sprite(spritesheet['redrightwalk1.png']);
    redBoyRightWalk1.position.set(70, 50);

    redBoyRightWalk2 = new Sprite(spritesheet['redrightwalk2.png']);
    redBoyRightWalk2.position.set(90, 50);

    app.stage.addChild(redBoyRight);
    app.stage.addChild(redBoyRightWalk1);
    app.stage.addChild(redBoyRightWalk2);

    const message = new Text('Hello Pixi!', {
      fill: '#FFFFFF',
      stroke: '#FF3300',
      strokeThickness: 4,
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowBlur: 4,
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 6,
    });
    message.position.set(150, 150);
    app.stage.addChild(message);
  });

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
