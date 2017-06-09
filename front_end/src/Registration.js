import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router';
import Register from './Register';
import { Tabs, Tab } from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';


class Registration extends Component {
  constructor() {
    super();
    this.state = { username: null, password: null, warning: 'no-warning' };
  }


  render() {
    return (

      <div id="auth">
        <video playsInline autoPlay muted loop id="videobackground">
          <source src="../a-working-man.mp4" type='type="video/mp4"' />
          <source src="../a-working-man.mp4" type="video/webm" />
        </video>
        <div className='welcomeinfo row text-center'>
          <h2>Find Meetup near you!</h2>
          <h3>Let's get started</h3>
        </div>
        <div className='row logincontainer'>
          <div className=' welcomeContainer col-md-2 col-md-offset-2 line text-center'>
          </div>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Registration;