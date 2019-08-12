import 'normalize.css';
import * as PIXI from 'pixi.js';
import scaleToWindow from './assets/js/scaleToWindow';
import keyboard from './assets/js/keyboard';
import hitTestRectangle from './assets/js/hitTestReactangle';

const treasureHunterJson = require('./assets/images/treasureHunter/treasureHunter.json'); // eslint-disable-line @typescript-eslint/no-var-requires
// eslint-disable-next-line @typescript-eslint/no-var-requires, import/no-dynamic-require
const treasureHunterImg = require(`./assets/images/treasureHunter/${treasureHunterJson.meta.image}`);

const {
  Application,
  Loader,
  Sprite,
  Spritesheet,
  Graphics,
  Text,
  Container,
} = PIXI;

const app = new Application({
  antialias: true,
});

document.body.appendChild(app.view);

window.addEventListener('resize', (): void => {
  scaleToWindow(app.renderer.view);
});

app.renderer.backgroundColor = 0x061639;
app.renderer.view.style.position = 'absolute';
app.renderer.view.style.display = 'block';
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);

interface RedBoyRightI extends PIXI.Sprite {
  vx?: number;
  vy?: number;
}

let state: (delta: number) => void;
let gameScene: PIXI.Container;
let dungeon: PIXI.Sprite;
let door: PIXI.Sprite;
let gameOverScene: PIXI.Container;
let redBoyRight: RedBoyRightI;
let box: PIXI.Graphics;
let message: PIXI.Text;

const end = () => {

};

const play = (delta: number) => {

};

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
  // 主遊戲場景
  gameScene = new Container();
  app.stage.addChild(gameScene);

  // treasureHunter
  const sheet = new Spritesheet(resource[treasureHunterImg].texture, treasureHunterJson);
  sheet.parse((spritesheet): void => {
    dungeon = new Sprite(spritesheet['dungeon.png']);
    gameScene.addChild(dungeon);

    door = new Sprite(spritesheet['door.png']);
    door.position.set(32, 0);
    gameScene.addChild(door);
  });

  gameOverScene = new Container();
  app.stage.addChild(gameOverScene);
  gameOverScene.visible = false;

  app.stage.addChild(gameScene);
  app.stage.addChild(gameOverScene);

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

  state = play;

  app.ticker.add((delta: number): void => gameLoop(delta));
};

const loadProgressHandler = (pixiLoader: PIXI.Loader, resource: PIXI.LoaderResource): void => {
  console.log(`loading ${resource.url}`);
  console.log(`progress ${pixiLoader.progress} %`);
};

new Loader()
  .add(treasureHunterImg)
  .on('progress', loadProgressHandler)
  .load(setup);
