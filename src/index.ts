import 'normalize.css';
import { random } from 'lodash';
import * as PIXI from 'pixi.js';
import scaleToWindow from './assets/js/scaleToWindow';
import keyboard from './assets/js/keyboard';
import hitTestRectangle from './assets/js/hitTestReactangle';
import contain from './assets/js/contain';

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
  TextStyle,
} = PIXI;

const app = new Application({
  antialias: true,
});

document.body.appendChild(app.view);

window.addEventListener('resize', (): void => {
  scaleToWindow(app.renderer.view);
});

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
let gameScene: PIXI.Container; // 遊戲場景
let dungeon: PIXI.Sprite; // 地下城場景: Sprite
let door: PIXI.Sprite; // 門: Sprite
let explorer: ExplorerI; // 冒險者: Sprite
let treasure: PIXI.Sprite; // 寶藏: Sprite
let blobs: BlobI[]; // 泡泡怪們: Sprite[]
let healthBar: HealthBarI; // 血條: Container
let gameOverScene: PIXI.Container; // 結束畫面場景
let message: PIXI.Text; // 結束畫面文字

const end = (): void => {
  gameScene.visible = false;
  gameOverScene.visible = true;
};

const play = (delta: number): void => {
  let explorerHit = false;

  if (explorer) {
    explorer.x += explorer.vx;
    explorer.y += explorer.vy;
    contain(explorer, {
      x: 28,
      y: 10,
      width: 488,
      height: 480,
    });
  }

  if (blobs.length > 0) {
    blobs.forEach((blob): void => {
      blob.position.set(blob.x, blob.y + blob.vy);

      const blobHitsWall = contain(blob, {
        x: 28,
        y: 10,
        width: 488,
        height: 480,
      });

      if (blobHitsWall === 'top' || blobHitsWall === 'bottom') {
        Object.assign(blob, { vy: blob.vy * -1 });
      }

      if (hitTestRectangle(explorer, blob)) {
        explorerHit = true;
      }
    });
  }

  if (explorerHit) {
    explorer.alpha = 0.5;
    healthBar.outer.width -= 1;
  } else {
    explorer.alpha = 1;
  }

  if (hitTestRectangle(explorer, treasure)) {
    treasure.x = explorer.x + 8;
    treasure.y = explorer.y + 8;
  }

  if (hitTestRectangle(treasure, door)) {
    state = end;
    message.text = 'You won!';
  }

  if (healthBar.outer.width < 0) {
    state = end;
    message.text = 'You lost!';
  }
};

const gameLoop = (delta: number): void => {
  state(delta);
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

    // 鍵盤控制冒險者
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

    new Array(numberOfBlobs).fill(null).forEach((item, index): void => {
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
  gameOverScene.visible = false;
  app.stage.addChild(gameOverScene);

  const textStyle = new TextStyle({
    fontFamily: 'Futura',
    fontSize: 64,
    fill: '#FFFFFF',
  });

  message = new Text('The End!', textStyle);
  message.position.set(120, app.stage.height / 2 - 32);
  gameOverScene.addChild(message);

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
