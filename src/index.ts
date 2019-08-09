import 'normalize.css';
import * as PIXI from 'pixi.js';
import scaleToWindow from './assets/js/scaleToWindow';

const catImg = require('./assets/images/cat.png'); // eslint-disable-line @typescript-eslint/no-var-requires

const {
  Application,
  Loader,
  Sprite,
  resources,
} = PIXI;

const app = new PIXI.Application({
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

const setup = (): void => {
  console.log('setup');

  const sprite = PIXI.Sprite.from(catImg);

  app.stage.addChild(sprite);
};

const loadProgressHandler = (loader, resource): void => {
  console.log(`loading ${resource.url}`);
  console.log(`progress ${loader.progress} %`);
};

const loader = new Loader();
loader
  .add(catImg)
  .on('progress', loadProgressHandler)
  .load(setup);
