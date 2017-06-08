import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Map from './Map';
import {Link} from 'react-router';
import Register from './Register';
import Login from './Login';


class App extends Component {
  render() {
    return (
      <div className="App">
         {this.props.children}   
      </div>
    );
  }
}

export default App;
