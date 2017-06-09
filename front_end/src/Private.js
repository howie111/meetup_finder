import React, { Component } from 'react';
import { Link } from 'react-router';
import axios from 'axios';
import './App.css';
import Map from './Map';
import Recordmap from './Recordmap';
import {Router,Route,browserHistory,IndexRoute} from 'react-router';

class PrivatePage extends Component {
  constructor() {
    super();
    this.state = { data: null, loading: true, auth: false, id: null }
  }
  componentDidMount() {
    console.log("Private Page Mounted")
    const self = this;
    if (localStorage.authToken !== undefined && localStorage.authToken !== null) {
      //Add token to request header
      console.log("Private Page Token: " + localStorage.authToken)
      axios
        .get('/private/record', { headers: { 'authorization': localStorage.authToken } })
        .then((res) => {
          if (res.status === 200) {
            self.setState({
              loading: false,
              auth: true,
              data: res.data.username,
              id: res.data.id
            });
          }
        }).catch((err) => {
          window.location.href = '/';
        })
    }
    else {
      window.location.href = '/';
    }
  }
 
  render() {
    if (this.state.loading) {
      return <div>loading ...</div>;
    }
    else {
      return (
        <div>
          <nav className="navbar navbar-inverse">
            <div className="container-fluid">
              <div className="navbar-header">
                <a className="navbar-brand" id='logo' href="#"><img src='../meetup.svg' width='50px' height='50px' /></a>
              </div>
              <ul className="nav navbar-nav">
                <li className="active"><a href="/private/">Home</a></li>            
              </ul>        
              <ul className="nav navbar-nav navbar-right">
               <li className="active"> <a> Hello! {this.state.data} </a></li>
               <li><a href="/private/record"><span class="glyphicon glyphicon-log-in"></span> My Meetup</a></li>
               <li><a  href="javascript:history.back()"><span class="glyphicon glyphicon-log-in"></span> Go Back</a></li>
               <li><a href="/"><span class="glyphicon glyphicon-log-in"></span> Logout</a></li>
              </ul>
            </div>
          </nav>
          {React.cloneElement(this.props.children, { userId: this.state.id })}
        </div>
      );
    }
  }
}

export default PrivatePage;