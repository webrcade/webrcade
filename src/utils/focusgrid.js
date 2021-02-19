import { GamepadEnum } from './gamepadenum.js'

class FocusGrid {
    comps = [];
  
    setComponents(comps) {
      this.comps = comps;
    }
  
    getComponentLocation(comp) {
      const { comps } = this;
  
      for (let y = 0; y < comps.length; y++) {
        let xarr = comps[y];
        for (let x = 0; x < xarr.length; x++) {
          if (comps[y][x] === comp) {
            return [y, x];
          }
        }
      }
      return null;
    }
  
    checkComp(c) {
      if (c && c.current && c.current.focus) {
        return c;      
      } 
      return null;
    }
  
    moveFocus(dir, comp) {
      const that = this;
      const { comps } = this;
      const loc = this.getComponentLocation(comp);
  
      const checkRowForComp = (row) => {
        let comp = null;
        for (let x = 0; x < row.length && !comp; x++) {
          comp = that.checkComp(row[x]);
        }
        return comp;
      }
  
      if (loc) {
        let y = loc[0], x = loc[1];
        let row = comps[y];      
  
        let comp = null;
        switch (dir) {
          case GamepadEnum.LEFT:
            x--;
            while( x >= 0 && !comp) {
              comp = this.checkComp([y][x]);
              x--;
            }
            break;
          case GamepadEnum.RIGHT:
            x++;
            while( x < row.length && !comp) {
              comp = this.checkComp([y][x]);
              x++;
            }
            break;
          case GamepadEnum.UP:
            y--;
            while( y >= 0 && !comp) {
              comp = checkRowForComp(comps[y]);
              y--;
            }
            break;
          case GamepadEnum.DOWN:
            y++;
            while( y < comps.length && !comp) {
              comp = checkRowForComp(comps[y]);
              y++;
            }
            break;
          default:
            break;
        }
        if (comp) return comp.current.focus();
      }
      return false;
    }
  
    focus() {
      const { comps } = this;
  
      for (let y = 0; y < comps.length; y++) {
        let xarr = comps[y];
        for (let x = 0; x < xarr.length; x++) {
          let comp = comps[y][x];
          if (this.checkComp(comp)) {
            return comp.current.focus();
          }
        }
      }
  
      return false;
    }
  }
  
  export { FocusGrid };
  