import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router';
import Register from './Register';
import { Tabs, Tab } from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';

class Login extends Component {
  constructor() {
    super();
    this.state = { username: null, password: null, warning: 'no-warning' };
    this.formSubmit = this.formSubmit.bind(this);
    this.txtFieldChange = this.txtFieldChange.bind(this);
  }
  formSubmit(e) {
    let self = this;
    e.preventDefault();
    axios
      .post('/login', this.state)
      .then((res) => {

        localStorage.authToken = res.data.token;
        window.location.href = "/private/";
      })
      .catch(() => {
        self.setState({
          warning: 'Invalid user or password infomation'
        })
      })
  }

  txtFieldChange(e) {
    if (e.target.name === "username") { this.state.username = e.target.value }
    else if (e.target.name === "password") { this.state.password = e.target.value }

    this.setState({
      username: this.state.username,
      password: this.state.password
    });
  }
  render() {
    return (
      <div className='col-md-4 line loginform'>
        <h3>Login Form</h3>
        <p className={"alert alert-danger " + this.state.warning}>Incorrect username or password</p>
        <p className='registerinfo'>
          Need an Account? <a href='/register'><strong>SignUp</strong></a>
        </p>
        <form onSubmit={this.formSubmit}>
          <div className="form-group">
            <div className='input-group'>
              <div className="input-group-addon">
                <span className="glyphicon glyphicon-user"></span>
              </div>
              <input
                onChange={this.txtFieldChange}
                className="form-control"
                type="text"
                placeholder="Username"
                name="username" />
            </div>
          </div>
          <div className="form-group">
            <div className='input-group'>
              <div className="input-group-addon">
                <span className="glyphicon glyphicon-lock"></span>
              </div>
              <input
                onChange={this.txtFieldChange}
                className="form-control"
                type="password"
                placeholder="Password"
                name="password" />
            </div>
            <div className="form-group text-center">
              <button className="btn btn-primary" id="loginbtn">Login</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default Login;