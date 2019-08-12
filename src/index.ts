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
  ParticleContainer,
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

const redBoyContainer = new ParticleContainer();

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

    redBoyContainer.addChild(redBoyRight);
    redBoyContainer.addChild(redBoyRightWalk1);
    redBoyContainer.addChild(redBoyRightWalk2);

    redBoyContainer.position.set(64, 64);

    app.stage.addChild(redBoyContainer);

    console.log('========================');
    console.log('redBoyContainer');
    console.log(`width: ${redBoyContainer.width}`);
    console.log(`height: ${redBoyContainer.height}`);
    console.log(`x: ${redBoyContainer.x}`);
    console.log(`y: ${redBoyContainer.y}`);

    console.log('========================');
    console.log('redBoyRight');
    console.log(`x: ${redBoyRight.x}`);
    console.log(`y: ${redBoyRight.y}`);
    console.log(redBoyRight.position);

    console.log('========================');
    console.log('redBoyContainer.toGlobal(redBoyRight.position):');
    console.log(redBoyContainer.toGlobal(redBoyRight.position));
    console.log('redBoyRight.parent.toGlobal(redBoyRight.position):');
    console.log(redBoyRight.parent.toGlobal(redBoyRight.position));

    console.log('========================');
    console.log('redBoyRight.getGlobalPosition():');
    console.log(redBoyRight.getGlobalPosition());

    console.log('========================');
    console.log('toLocal():');
    console.log(redBoyRight.toLocal(redBoyRight.position, redBoyRightWalk2));
    console.log(redBoyRightWalk1.toLocal(redBoyRightWalk1.position, redBoyRightWalk2));
    console.log(redBoyRightWalk2.toLocal(redBoyRightWalk2.position, redBoyRightWalk2));
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
