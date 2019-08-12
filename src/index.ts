import 'normalize.css';
import { random } from 'lodash';
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
  Container,
  Graphics,
  Text,
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

interface ExplorerI extends PIXI.Sprite {
  vx?: number;
  vy?: number;
}

interface BlobI extends PIXI.Sprite {
  vy?: number;
}

interface HealthBarI extends PIXI.Container {
  outer?: PIXI.Graphics;
}

let state: (delta: number) => void;
let gameScene: PIXI.Container;
let dungeon: PIXI.Sprite;
let door: PIXI.Sprite;
let explorer: ExplorerI;
let treasure: PIXI.Sprite;
let blobs: BlobI[];
let healthBar: HealthBarI;
let gameOverScene: PIXI.Container;
let box: PIXI.Graphics;
let message: PIXI.Text;

const end = () => {

};

const play = (delta: number) => {

};

const gameLoop = (delta: number): void => {
  if (explorer) {
    explorer.x += explorer.vx;
    explorer.y += explorer.vy;

    // if (hitTestRectangle(explorer, box)) {
    //   box.tint = 0xff3300;
    //   message.text = 'hit!';
    // } else {
    //   box.tint = 0xccff99;
    //   message.text = 'No collision...';
    // }
  }
};

const setup = (pixiLoader: PIXI.Loader, resource: PIXI.LoaderResource): void => {
  // 主遊戲場景
  gameScene = new Container();
  app.stage.addChild(gameScene);

  // treasureHunter
  const sheet = new Spritesheet(resource[treasureHunterImg].texture, treasureHunterJson);
  sheet.parse((spritesheet): void => {
    // 地下城場景
    dungeon = new Sprite(spritesheet['dungeon.png']);
    gameScene.addChild(dungeon);

    // 門
    door = new Sprite(spritesheet['door.png']);
    door.position.set(32, 0);
    gameScene.addChild(door);

    // 冒險者
    explorer = new Sprite(spritesheet['explorer.png']);
    explorer.position.set(68, gameScene.height / 2 - explorer.height / 2);
    explorer.vx = 0;
    explorer.vy = 0;
    gameScene.addChild(explorer);

    // 寶藏
    treasure = new Sprite(spritesheet['treasure.png']);
    treasure.position.set(
      gameScene.width - treasure.width - 48,
      gameScene.height / 2 - treasure.height / 2,
    );
    gameScene.addChild(treasure);

    // 泡泡怪們
    const numberOfBlobs = 6;
    const spacing = 48;
    const xOffset = 150;
    const speed = 2;
    let direction = 1;

    blobs = [];

    new Array(numberOfBlobs).fill(null).map((item, index): void => {
      const blob: BlobI = new Sprite(spritesheet['blob.png']);

      const x = spacing * index + xOffset;
      const y = random(0, app.stage.height - blob.height);

      blob.position.set(x, y);

      blob.vy = speed * direction;

      direction *= -1;

      blobs.push(blob);

      gameScene.addChild(blob);
    });

    // 血條
    healthBar = new Container();
    healthBar.position.set(app.stage.width - 170, 4);
    gameScene.addChild(healthBar);

    const innerBar = new Graphics();
    innerBar.beginFill(0x000000);
    innerBar.drawRect(0, 0, 128, 8);
    innerBar.endFill();
    healthBar.addChild(innerBar);

    const outerBar = new PIXI.Graphics();
    outerBar.beginFill(0xFF3300);
    outerBar.drawRect(0, 0, 128, 8);
    outerBar.endFill();
    healthBar.addChild(outerBar);

    healthBar.outer = outerBar;
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
    explorer.vx = -5;
    explorer.vy = 0;
  };

  left.release = (): void => {
    if (!right.isDown && explorer.vy === 0) {
      explorer.vx = 0;
    }
  };

  up.press = (): void => {
    explorer.vx = 0;
    explorer.vy = -5;
  };

  up.release = (): void => {
    if (!down.isDown && explorer.vx === 0) {
      explorer.vy = 0;
    }
  };

  right.press = (): void => {
    explorer.vx = 5;
    explorer.vy = 0;
  };

  right.release = (): void => {
    if (!left.isDown && explorer.vy === 0) {
      explorer.vx = 0;
    }
  };

  down.press = (): void => {
    explorer.vx = 0;
    explorer.vy = 5;
  };

  down.release = (): void => {
    if (!up.isDown && explorer.vx === 0) {
      explorer.vy = 0;
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
