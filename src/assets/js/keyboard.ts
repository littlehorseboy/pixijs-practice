interface KeyI {
  code: any;
  isDown: boolean;
  isUp: boolean;
  press: any;
  release: any;
  downHandler(event: any): void;
  upHandler(event: any): void;
}

export default function keyboard(keyCode): KeyI {
  const key = {
    code: keyCode,
    isDown: false,
    isUp: true,
    press: undefined,
    release: undefined,
    downHandler(event): void {
      event.preventDefault();
      if (event.keyCode === key.code) {
        if (key.isDown && key.release) {
          key.release();
        }
        key.isDown = false;
        key.isUp = true;
      }
    },
    upHandler(event): void {
      event.preventDefault();

      if (event.keyCode === key.code) {
        if (key.isUp && key.press) {
          key.press();
        }
        key.isDown = true;
        key.isUp = false;
      }
    },
  };

  return key;
}
