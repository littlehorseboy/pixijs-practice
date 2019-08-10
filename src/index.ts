import 'normalize.css';
import * as PIXI from 'pixi.js';
import scaleToWindow from './assets/js/scaleToWindow';

const catImg = require('./assets/images/cat.png'); // eslint-disable-line @typescript-eslint/no-var-requires
const tilesetImg = require('./assets/images/tileset.png'); // eslint-disable-line @typescript-eslint/no-var-requires
const redBoyJson = require('./assets/images/Boy Pixel/redBoy/redBoy.json'); // eslint-disable-line @typescript-eslint/no-var-requires
const redBoyImg = require(`./assets/images/Boy Pixel/redBoy/${redBoyJson.meta.image}`); // eslint-disable-line @typescript-eslint/no-var-requires

const {
  Application,
  Loader,
  Sprite,
  Rectangle,
  Spritesheet,
} = PIXI;

const { TextureCache } = PIXI.utils;

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

const setup = (loader, resource): void => {
  console.log('setup');

  // cat.png
  const cat = Sprite.from(catImg);

  cat.position.set(96, 155);
  cat.width = 150;
  cat.height = 150;

  cat.scale.set(0.5, 0.5);

  cat.rotation = Math.PI; // https://www.mathsisfun.com/geometry/radians.html
  cat.anchor.x = 0.5;
  cat.anchor.y = 0.5;

  app.stage.addChild(cat);

  // tileset.png
  const texture = TextureCache[tilesetImg];
  const rectangle = new Rectangle(32 * 3, 32 * 2, 32, 32);

  texture.frame = rectangle;

  const rocket = new Sprite(texture);
  rocket.x = 32;
  rocket.y = 32;

  app.stage.addChild(rocket);

  // redBoy
  const sheet = new Spritesheet(resource['images/redBoy.png'].texture, redBoyJson);
  sheet.parse((something): void => {
    const redBoyRight = new Sprite(something['redright.png']);
    redBoyRight.x = 0;
    redBoyRight.y = 0;
    app.stage.addChild(redBoyRight);
  });
};

const loadProgressHandler = (loader, resource): void => {
  console.log(`loading ${resource.url}`);
  console.log(`progress ${loader.progress} %`);
};

loader
  .add(catImg)
  .add(tilesetImg)
  .add(redBoyImg)
  .on('progress', loadProgressHandler)
  .load(setup);
