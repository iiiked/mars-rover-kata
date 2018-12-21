import Rover from './Rover.js';

class Grid {
  constructor(x, y) {
    this.xSize = x;
    this.ySize = y;
    this.map = [...Array(y)].map(i => Array(x).fill(0));
    this.history = [];
    this.rovers = [];
    this.roverCount = 0;
  }

  addObstacle(x, y) {
    if (this.map[y][x] === 0) {
      this.map[y][x] = 'X';
    } else {
      console.error(`Position x: ${x}, y: ${y} is taken or non-existent`);
    }
  }

  addRover(rover, x, y) {
    if (this.roverCount > 3) {
      console.error(`Maximum number of rovers (4) reached`);
      return;
    }
    if (this.map[y][x] === 0) {
      this.map[y][x] = rover;
      this.rovers.push(rover);
      this.roverCount++;
      this.recordMove();
    } else {
      console.error(`Position x: ${x}, y: ${y} is taken or non-existent`);
    }
  }

  moveRover(rover, x, y) {
    this.map[y][x] = rover;
  }

  clearCell(x, y) {
    this.map[y][x] = 0;
  }

  getCellInfo(x, y) {
    switch(true) {
      case x < 0 || x >= this.xSize || y < 0 || y >= this.ySize:
        return {
          status: 'unreachable',
          id: 'end of map',
        }
      case this.map[y][x] === 0:
        return {
          status: 'clear',
          id: 0,
        };
      case this.map[y][x] === 'X':
        return {
          status: 'unreachable',
          id: 'obstacle',
        };
      case this.map[y][x] instanceof Rover:
        return {
          status: this.map[y][x].status === 'moving' ? 'occupied' : 'unreachable',
          id: 'rover',
        };
      default:
        console.error(`Couldn't recognize position or object on position x: ${x}, y: ${y}.`);
        return {
          status: 'error',
          id: -1,
        };
    }
  }

  recordMove() {
    const mapClone = [];
    this.map.forEach(row => mapClone.push([...row].map((o) => {
      if (o instanceof Rover) {
        const obj = {};
        obj.id = o.id;
        obj.direction = o.direction;
        obj.status = o.status === 'moving' ? o.status : o.missionResult === 'failed' ? o.status : 'finished';
        return obj;
      }
      return o;
    })));
    this.history.push(mapClone);
  }

  run(mps) {
    mps = mps === undefined ? 0 : parseInt(mps) > 0 && parseInt(mps) < 11 ? parseInt(mps) : 2;
    let indexCounter = 0;
    const int = setInterval(() => {
      const getNextIndex = (arr, index, callback) => {
        if (!arr.filter(callback).length) return -1;
        if (index < arr.length && callback(arr[index])) return index;
	      return getNextIndex(arr, index >= arr.length - 1 ? 0 : ++index, callback);
      };
      indexCounter = getNextIndex(this.rovers, indexCounter, (rover) => rover.status === 'moving');
      indexCounter === -1 ? clearInterval(int) : this.rovers[indexCounter++].move();
    }, mps === 0 ? mps : 1000 / mps);
  }
}

export default Grid;