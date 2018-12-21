import React, { Component } from 'react';

import DialogCard from './dialogcards/DialogCard';
import TravelLog from './travellog/TravelLog';

import Grid from './classes/Grid';
import Rover from './classes/Rover';

let mars = {};

class IndexComponent extends Component {
  constructor() {
    super();
    this.state = {
      grid: {
        xSize: 10,
        ySize: 10,
      },
      layout: [],
      listening: false,
      controlStep: 1,
      prinntTravelLog: false,
    };

    this.updateGridSize = this.updateGridSize.bind(this);
    this.nextMessage = this.nextMessage.bind(this);
    this.addObstacle = this.addObstacle.bind(this);
    this.handleObstacleClick = this.handleObstacleClick.bind(this);
    this.addRover = this.addRover.bind(this);
    this.handleRoverClick = this.handleRoverClick.bind(this);
    this.addRoverCommands = this.addRoverCommands.bind(this);
    this.runMap = this.runMap.bind(this);
    this.printTravelLog = this.printTravelLog.bind(this);
    this.reset = this.reset.bind(this);
  }

  componentWillMount() {
    document.body.style.setProperty('--grid-x-size', this.state.grid.xSize);
    document.body.style.setProperty('--grid-y-size', this.state.grid.ySize);
  }

  componentWillUpdate(nextProps, nextState) {
    const { controlStep, listening } = nextState;
    if ((controlStep === 2 || controlStep === 3) && !listening) {
      this.setState({
        listening: true,
      });
    } else if ((controlStep !== 2 && controlStep !== 3) && listening) {
      this.setState({
        listening: false,
      });
    }
  }

  componentDidUpdate() {
    const { controlStep, grid } = this.state;
    switch(controlStep) {
      case 2:
        document.body.style.setProperty('--grid-x-size', grid.xSize);
        document.body.style.setProperty('--grid-y-size', grid.ySize);
        document.getElementById('grid').addEventListener('click', this.handleObstacleClick);
        break;
      case 3:
        document.getElementById('grid').removeEventListener('click', this.handleObstacleClick);
        document.getElementById('grid').addEventListener('click', this.handleRoverClick);
        break;
      case 4:
        document.getElementById('grid').removeEventListener('click', this.handleRoverClick);
        break;
      default:
    }
  }

  componentDidMount() {
    const { grid } = this.state;
    mars = new Grid(grid.xSize, grid.ySize);
    this.setState({
      layout: mars.map,
    });
  }

  updateGridSize(size) {
    size = Number(size) > 4 && Number(size) < 26 ? Number(size) : 10;
    mars = new Grid(size, size);
    this.setState({
      grid: {
        xSize: size,
        ySize: size,
      },
      layout: mars.map,
      controlStep: this.state.controlStep === 1 ? 2 : this.state.controlStep,
    });
  }

  nextMessage(step) {
    step = step || this.state.controlStep + 1;
    this.setState({
      controlStep: step,
    });
  }

  addObstacle(x, y) {
    mars.addObstacle(x, y);
    this.setState({
      layout: mars.map,
    });
  }

  handleObstacleClick(e) {
    const { xSize } = this.state.grid;
    if (e.target.classList.contains('listen')) {
      const x = e.target.id % xSize;
      const y = Math.floor(e.target.id / xSize);
      this.addObstacle(x, y);
    }
  }

  handleRoverClick(e) {
    const { xSize } = this.state.grid;
    if (e.target.classList.contains('listen')) {
      const x = e.target.id % xSize;
      const y = Math.floor(e.target.id / xSize);
      this.addRover(x, y);
    }
  }

  addRover(x, y) {
    const currentRoverIndex = mars.roverCount || 0;
    const rover = new Rover(currentRoverIndex + 1, x, y, 'n', mars);
    this.setState({
      layout: mars.history[mars.history.length - 1],
      controlStep: this.state.controlStep + 1,
    });
  }

  addRoverCommands(val) {
    const currentRover = mars.rovers[mars.rovers.length - 1];
    currentRover.addCommands(val);
    this.nextMessage();
  }

  printTravelLog() {
    this.setState({
      prinntTravelLog: true,
    });
  }

  reset() {
    mars = {};
    this.setState({
      grid: {
        xSize: 10,
        ySize: 10,
      },
      layout: [],
      listening: false,
      controlStep: 1,
      prinntTravelLog: false,
    });
  }

  runMap(mps) {
    mps = parseInt(mps);
    mps = mps > 0 && mps < 25 ? mps : 2;
    mars.run();
    let index = 0;
    let int = setInterval(() => {
      if (index >= mars.history.length - 1) {
        clearInterval(int);
        int = null;
      }
      this.setState({
        layout: mars.history[index],
        controlStep: int ? 7 : 8,
      });
      index++;
    }, 1000 / mps);
  }

  render() {
    return (
      <>
        <div className="flex-row">
          <div className="grid-container flex-center">
            <div className="grid" id="grid">
              {this.state.layout.flat().map((cell, index) => {
                const classList = ['grid-cell'];
                if (cell === 'X') classList.push('x');
                if (cell instanceof Object) {
                  classList.push('rover', `rover-${cell.id}`, `rover-${cell.direction}`);
                  if (cell.status === 'stopped') classList.push('stuck');
                  if (cell.status === 'finished') classList.push('won');
                }
                if (this.state.listening && cell === 0) classList.push('listen');
                return (
                  <div className={classList.join(' ')} key={`cell-${index}`} id={index} />
                );
              })}
            </div>
          </div>
          <div className="controls-container flex-center">
              <DialogCard
                step={this.state.controlStep}
                currentGridSize={this.state.grid.xSize}
                updateGridSize={this.updateGridSize}
                nextMessage={this.nextMessage}
                roverCount={mars.hasOwnProperty('roverCount') ? mars.roverCount : 0}
                addRoverCommands={this.addRoverCommands}
                runMap={this.runMap}
                viewTravelLog={this.printTravelLog}
                resetGrid={this.reset}
              />
          </div>
        </div>
        {this.state.prinntTravelLog ? <TravelLog rovers={mars.rovers} resetGrid={this.reset} /> : null}
      </>
    );
  }
}

export default IndexComponent;
