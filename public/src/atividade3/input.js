class InputManager {
    constructor() {
      this.keys = {};
      const keyMap = new Map();
   
      const setKey = (keyName, pressed) => {
        const keyState = this.keys[keyName];
        keyState.justPressed = pressed && !keyState.down;
        keyState.down = pressed;
      };
   
      const addKey = (keyCode, name) => {
        this.keys[name] = { down: false, justPressed: false };
        keyMap.set(keyCode, name);
      };
   
      const setKeyFromKeyCode = (keyCode, pressed) => {
        const keyName = keyMap.get(keyCode);
        if (!keyName) {
          return;
        }
        setKey(keyName, pressed);
      };
   
      addKey(37, 'left');
      addKey(39, 'right');
      addKey(38, 'up');
      addKey(40, 'down');
      addKey(89, 'y');
      addKey(85, 'u');
      addKey(72, 'h');
      addKey(74, 'j');
      addKey(78, 'n');
      addKey(77, 'm');

   
      window.addEventListener('keydown', (e) => {
        setKeyFromKeyCode(e.keyCode, true);
      });
      window.addEventListener('keyup', (e) => {
        setKeyFromKeyCode(e.keyCode, false);
      });
      window.addEventListener('keypress', (e) => {
        setKeyFromKeyCode(e.keyCode, true);
      });
    }
    update() {
      for (const keyState of Object.values(this.keys)) {
        if (keyState.justPressed) {
          keyState.justPressed = false;
        }
      }
    }
  }