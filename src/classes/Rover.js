class Rover {
  constructor(id = 1, x = 0, y = 0, dir = 'n', grid) {
    const roverNames = ['Curiosity', 'Spirit', 'Opportunity', 'Sojourner'];
    this.id = id;
    this.name = roverNames[id - 1] || roverNames[0];
    this.direction = dir;
    this.x = x;
    this.y = y;
    this.position = [x, y];
    this.travelLog = [];
    this.status = 'moving';
    this.missionResult = 'running';
    this.compass = ['n', 'e', 's', 'w'];
    this.commands = [];
    this.movesSkipped = 0;
    this.map = grid;
    if (grid.getCellInfo(x, y).status === 'clear') {
      grid.addRover(this, x, y);
      this.travelLog.push({
        message: `Initialized on position x: ${this.x}, y: ${this.y}. Turning power on and ready to roll...`,
        missionStatus: this.missionResult,
        status: this.status,
      });
    } else {
      this.map = {};
      console.error('Cannot add rover on the map. Reassign position or add new map');
    }
  }

  changePosition([x, y]) {
    this.x = x;
    this.y = y;
    this.position = [x, y];
  }

  addMap(grid) {
    if (grid.getCellInfo(this.x, this.y).status === 'clear') {
      this.map = grid;
      grid.addRover(this, this.x, this.y);
    } else {
      this.map = {};
      console.error('Cannot add rover on the map. Reassign position or add new map');
    }
  }

  turnLeft() {
    let index = this.compass.indexOf(this.direction) - 1;
    this.direction = this.compass[index < 0 ? 3 : index];
    this.status = this.commands.length ? this.status : 'stopped';
    this.missionResult = this.commands.length ? this.missionResult : 'accomplished';
    this.travelLog.push({
      message: `Turned left on position x: ${this.x}, y: ${this.y}.${this.missionResult === 'accomplished' ? '\nMission accomplished!' : ''}`,
      missionStatus: this.missionResult,
      status: this.status,
    });
    this.map.recordMove();
  }

  turnRight() {
    let index = this.compass.indexOf(this.direction) + 1;
    this.direction = this.compass[index > 3 ? 0 : index];
    this.status = this.commands.length ? this.status : 'stopped';
    this.missionResult = this.commands.length ? this.missionResult : 'accomplished';
    this.travelLog.push({
      message: `Turned right on position x: ${this.x}, y: ${this.y}.${this.missionResult === 'accomplished' ? '\nMission accomplished!' : ''}`,
      missionStatus: this.missionResult,
      status: this.status,
    });
    this.map.recordMove();
  }

  skipMove() {
    if (this.movesSkipped < 3) {
      this.status = this.commands.length ? this.status : 'stopped';
      this.missionResult = this.commands.length ? this.missionResult : 'accomplished';
      this.travelLog.push({
        message: `Skipped move on position x: ${this.x}, y: ${this.y}.${this.missionResult === 'accomplished' ? '\nMission accomplished!' : ''}`,
        missionStatus: this.missionResult,
        status: this.status,
      });
      this.map.recordMove();
    } else {
      this.stop('occupied cell');
    }
  }

  stop(reason) {
    this.status = 'stopped';
    this.missionResult = 'failed';
    this.commands = [];
    this.travelLog.push({
      message: `Stuck on position x: ${this.x}, y: ${this.y}. Reached ${reason}. Turning power off, waiting for new instructions...`,
      missionStatus: this.missionResult,
      status: this.status,
    });
    this.map.recordMove();
  }

  moveForward(command) {
    let x;
    let y;
    switch(this.direction) {
      case 'n':
        x = this.x;
        y = this.y - 1;
        break;
      case 'e':
        x = this.x + 1;
        y = this.y;
        break;
      case 's':
        x = this.x;
        y = this.y + 1;
        break;
      case 'w':
        x = this.x - 1;
        y = this.y;
        break;
      default:
        this.skipMove();
        this.movesSkipped++;
    } 
    const inspectResult = this.map.getCellInfo(x, y);
    switch (inspectResult.status) {
      case 'clear':
        const [prevX, prevY] = this.position;
        this.x = x;
        this.y = y;
        this.position = [x, y];
        this.status = this.commands.length ? this.status : 'stopped';
        this.missionResult = this.commands.length ? this.missionResult : 'accomplished';
        this.travelLog.push({
          message: `Moved forward to position x: ${x}, y: ${y}.${this.missionResult === 'accomplished' ? '\nMission accomplished!' : ''}`,
          missionStatus: this.missionResult,
          status: this.status,
        });
        this.map.moveRover(this, x, y);
        this.map.clearCell(prevX, prevY);
        this.map.recordMove();
        break;
      case 'occupied':
      case 'error':
        this.skipMove();
        this.movesSkipped++;
        this.commands.push(command);
        break;
      case 'unreachable':
        this.stop(inspectResult.id);
        break;
      default:
        this.skipMove();
        this.movesSkipped++;
        this.commands.push(command);
    }
  }

  moveBackward(command) {
    let x;
    let y;
    switch(this.direction) {
      case 'n':
        x = this.x;
        y = this.y + 1;
        break;
      case 'e':
        x = this.x - 1;
        y = this.y;
        break;
      case 's':
        x = this.x;
        y = this.y - 1;
        break;
      case 'w':
        x = this.x + 1;
        y = this.y;
        break;
      default:
        this.skipMove();
        this.movesSkipped++;
    } 
    const inspectResult = this.map.getCellInfo(x, y);
    switch (inspectResult.status) {
      case 'clear':
        const [prevX, prevY] = this.position;
        this.x = x;
        this.y = y;
        this.position = [x, y];
        this.status = this.commands.length ? this.status : 'stopped';
        this.missionResult = this.commands.length ? this.missionResult : 'accomplished';
        this.travelLog.push({
          message: `Moved backward to position x: ${x}, y: ${y}.`,
          missionStatus: this.missionResult,
          status: this.status,
        });
        this.map.moveRover(this, x, y);
        this.map.clearCell(prevX, prevY);
        this.map.recordMove();
        break;
      case 'occupied':
      case 'error':
        this.skipMove();
        this.movesSkipped++;
        this.commands.push(command);
        break;
      case 'unreachable':
        this.stop(inspectResult.id);
        break;
      default:
        this.skipMove();
        this.movesSkipped++;
        this.commands.push(command);
    }
  }

  addCommands(val) {
    if (typeof val === 'string') {
      val = val.replace(/\s/g, '');
      for (let com of val) {
        this.commands.unshift(com);
      }
    } else if (Array.isArray(val)) {
      val = val.map(com => com.trim().charAt[0]);
      this.commands = [...val.reverse(), ...this.commands];
    } else {
      console.error('Couldn\'t recognize input. Must be a string or array of commands');
    }
  }

  move() {
    if (this.status === 'stopped') return;
    const command = this.commands.pop();
    switch (true) {
      case /f/i.test(command):
        this.moveForward(command);
        break;
      case /b/i.test(command):
        this.moveBackward(command);
        break;
      case /l/i.test(command):
        this.turnLeft();
        break;
      case /r/i.test(command):
        this.turnRight();
        break;
      case /s/i.test(command):
        this.skipMove();
        break;
      default:
        this.skipMove();
        this.movesSkipped++;
    }
  }
}

export default Rover;