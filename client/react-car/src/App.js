import React, { Component } from 'react';
import './App.css';
import WheelComponent from './Wheel';

/**
 * [middleRange the value between min and max of the rage input]
 * @type {Number}
 */
const middleRange = 50;


/**
 * gets a value from 0 to 1 proportional to the dutyCycles on a pin
 * @param  {number} speed value from 0 to 100 that can mean turning left or right. Value 0 is full left, value 50 is stop, value 100 is full right
 * @return {number}       value from 0 to 1 proportional to the dutyCycles on the pin. The negative/positive sign indicates which pin to set
 */
function getPulseModulation(speed) {
  return Math.abs((speed - middleRange) / middleRange);
}


// converts speed value to 2 pwm values driving the wheel
function wheelSpeedToPulseModulations(speed) {
  const modulation = getPulseModulation(speed)
    if (speed > middleRange) {
      return [0, modulation];
    } else {
      return [modulation, 0];
    }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      left: 50,
      right: 50
    };
  }

  render() {
    return (
      <div className="App wheels">
        <WheelComponent speed={this.state.left} changeSpeed={this.changeSpeed.bind(this, 'left')} />
        <WheelComponent speed={this.state.right} changeSpeed={this.changeSpeed.bind(this, 'right')} />
      </div>
    );
  }

  changeSpeed(wheelId, speed) {
    speed = parseInt(speed, 10);
    console.log(wheelId, speed);

    this.setState(prevState => ({
      ...prevState,
      [wheelId]: speed
    }));

    if (!this.sendingRequest) {
      this.sendCarPatch(...this.getPulseModulations());
    }
  }

  async sendCarPatch(...pulseModulations) {
    this.sendingRequest = true;
    const body = JSON.stringify({ pulseModulations });
    const endpoint = `http://jedrula.ddns.net:7002/car`;
    const response = await fetch(endpoint, {
      method: 'PATCH',
      body,
      headers: {
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json'
      }
    });
    const data = await response.json();
    this.sendingRequest = false;
    if (JSON.stringify(pulseModulations) !== JSON.stringify(this.getPulseModulations())) {
      this.sendCarPatch(...this.getPulseModulations());
    }
  }

  getPulseModulations() {
    return [
      ...wheelSpeedToPulseModulations(this.state.left),
      ...wheelSpeedToPulseModulations(this.state.right),
    ];
  }
}

export default App;
