import 'normalize.css';
import * as PIXI from 'pixi.js';
import { random } from 'lodash';
import scaleToWindow from './assets/js/scaleToWindow';

const redBoyJson = require('./assets/images/Boy Pixel/redBoy/redBoy.json'); // eslint-disable-line @typescript-eslint/no-var-requires
const redBoyImg = require(`./assets/images/Boy Pixel/redBoy/${redBoyJson.meta.image}`); // eslint-disable-line @typescript-eslint/no-var-requires

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

const setup = (loader, resource): void => {
  console.log('setup');

  // redBoy
  const numberOfBlobs = 6;
  const spacing = 160;
  const xOffset = 150;

  const sheet = new Spritesheet(resource['images/redBoy.png'].texture, redBoyJson);
  sheet.parse((something): void => {
    Array(numberOfBlobs).fill(null).forEach((item, index) => {
      const redBoyRight = new Sprite(something['redright.png']);
      const x = spacing * index + xOffset;
      const y = random(0, app.renderer.height - redBoyRight.height);
      redBoyRight.x = x;
      redBoyRight.y = y;
      app.stage.addChild(redBoyRight);
    });
  });
};

const loadProgressHandler = (loader, resource): void => {
  console.log(`loading ${resource.url}`);
  console.log(`progress ${loader.progress} %`);
};

loader
  .add(redBoyImg)
  .on('progress', loadProgressHandler)
  .load(setup);
