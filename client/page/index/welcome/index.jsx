import React, { Component } from 'react';
import './index.css';

export default class extends Component {
  constructor() {
    console.log(111);
    super();
  }

  render() {
    console.log(123);
    return (
      <div className="page-container">
        <div className="page-content">
          welcome
        </div>
      </div>
    );
  }
}