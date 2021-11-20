import {
  GamepadEnum
} from '@webrcade/app-common'

class BrowsingModeListener {
  constructor(notifier, callback) {
    this.notifier = notifier;
    this.callback = callback;
    this.registered = false;
    this.keyDown = false;
    this.resetCounts();

    this.notifierCallback = (e) => {
      switch (e.type) {
        case GamepadEnum.LEFT:
          this.leftPad++;
          break;
        case GamepadEnum.RIGHT:
          this.rightPad++;
          break;
        case GamepadEnum.UP:
          this.upPad++;
          break;
        case GamepadEnum.DOWN:
          this.downPad++;
          break;
        default:
          break;
      }
      this.checkSame();
    };

    this.keyDownListener = (e) => {
      this.keyDown = true;
    };

    this.keyUpListener = (e) => {
      if (!this.keyDown) return;
      this.keyDown = false;
      switch (e.code) {
        case 'ArrowRight':
          this.count++;
          this.rightKey++;
          break;
        case 'ArrowLeft':
          this.count++;
          this.leftKey++;
          break;
        case 'ArrowUp':
          this.count++;
          this.upKey++;
          break;
        case 'ArrowDown':
          this.count++;
          this.downKey++;
          break;
        default:
          break;
      }
      this.checkSame();
    };
  }

  registerListeners() {
    if (!this.registered) {
      this.resetCounts();
      this.notifier.addGlobalCallback(this.notifierCallback);
      document.addEventListener("keydown", this.keyDownListener);
      document.addEventListener("keyup", this.keyUpListener);
    }
    this.registered = true;
  }

  unregisterListeners() {
    if (this.registered) {
      this.notifier.removeGlobalCallback(this.notifierCallback);
      document.removeEventListener("keydown", this.keyDownListener);
      document.removeEventListener("keyup", this.keyUpListener);
      this.registered = false;
    }
  }

  checkSame() {
    if (this.count >= 2) {
      if ((this.upKey === this.upPad) &&
        (this.downKey === this.downPad) &&
        (this.rightKey === this.rightPad) &&
        (this.leftKey === this.leftPad)) {
        this.callback(); // Notify listener
      }
      if (this.count >= 3) {
        this.resetCounts();
      }
    }
  }

  resetCounts() {
    this.count = 0;
    this.rightKey = 0;
    this.leftKey = 0;
    this.upKey = 0;
    this.downKey = 0;
    this.rightPad = 0;
    this.leftPad = 0;
    this.upPad = 0;
    this.downPad = 0;
  }
}

export { BrowsingModeListener }