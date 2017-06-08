import React, { Component } from 'react';
import axios from 'axios';

class Register extends Component {
  constructor() {
    super();
    this.state = { username: null, password: null };

    this.formSubmit = this.formSubmit.bind(this);
    this.txtFieldChange = this.txtFieldChange.bind(this);
  }
  formSubmit(e) {
    e.preventDefault();
    axios
      .post('/encrypt', this.state)
      .then((res) => {
        window.location.href = '/';
      })
  }

  txtFieldChange(e) {
    if (e.target.name === "username") {
      this.state.username = e.target.value;
    }
    else if (e.target.name === "password") {
      this.state.password = e.target.value;
    }
    this.setState({
      username: this.state.username,
      password: this.state.password
    });
  }

  render() {
    return (

      <div className='line row logincontainer '>
        <div className='col-md-4 line loginform'>
          <h3>Registration Form</h3>
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
                <button className="btn btn-primary" id="loginbtn">Register</button>
              </div>
            </div>
          </form>
        </div>
      </div>

    );
  }
}


export default Register