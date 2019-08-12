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
} = PIXI;

const loader = new Loader();

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

let redBoyRight;

const gameLoop = (delta: number): void => {
  if (redBoyRight) {
    redBoyRight.vx = 1;
    redBoyRight.vy = 1;

    redBoyRight.x += redBoyRight.vx;
    redBoyRight.y += redBoyRight.vy;
  }
};

const setup = (pixiLoader: PIXI.Loader, resource: PIXI.LoaderResource): void => {
  console.log('setup');

  // redBoy
  const sheet = new Spritesheet(resource['images/redBoy.png'].texture, redBoyJson);
  sheet.parse((something): void => {
    redBoyRight = new Sprite(something['redright.png']);
    redBoyRight.x = 50;
    redBoyRight.y = 50;
    redBoyRight.vx = 0;
    redBoyRight.vy = 0;
    app.stage.addChild(redBoyRight);
  });

  app.ticker.add((delta): void => gameLoop(delta));
};

const loadProgressHandler = (pixiLoader: PIXI.Loader, resource: PIXI.LoaderResource): void => {
  console.log(`loading ${resource.url}`);
  console.log(`progress ${pixiLoader.progress} %`);
};

loader
  .add(redBoyImg)
  .on('progress', loadProgressHandler)
  .load(setup);
