import React, { Component } from 'react';

import './input.scss';

class Input extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      isValid: true,
    }
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({
      value: e.target.value,
      isValid: this.props.validator.test(e.target.value),
    });
  }

  render() {
    return (
      <>
        <label htmlFor={this.props.id}>{this.props.label}</label>
        <input type={this.props.type} id={this.props.id} value={this.state.value} onChange={this.handleChange} autoFocus />
        <div className={!this.state.isValid ? 'input-hint-warning' : 'input-hint'}>{this.props.hint}</div>
      </>
    );
  }
}

export default Input;