import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Router,Route,browserHistory,IndexRoute} from 'react-router';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Register from './Register';
import Login from './Login';
import Map from './Map';
import PrivatePage from './Private'
import TabsExampleSwipeable from './Landing'
import Registration from './Registration'
import Recordmap from './Recordmap'

const muiTheme = getMuiTheme({
  palette: {
  },
  appBar: {
    height: 70,
  }
});

ReactDOM.render(
    <MuiThemeProvider muiTheme={muiTheme}>
      <Router history={browserHistory}>
         <Route path='/' component={Registration}>
            <IndexRoute component={Login} />
            <Route path='register' component={Register} />
         </Route>
         <Route path='/private/' component={PrivatePage}>
            <IndexRoute component={Map} />
            <Route path='record' component={Recordmap} />
         </Route>
      </Router>    
  </MuiThemeProvider>, 
 document.getElementById('root'));
registerServiceWorker();
