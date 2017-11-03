import {render} from 'react-dom';
import React, { Component } from 'react';
import {
  hashHistory,
  Router,
  IndexRedirect,
  Route
} from 'react-router';
import Welcome from '@client/page/index/welcome/';
console.log(Welcome, 11, typeof Welcome);

class AppComponent extends Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div className="container">
        {this.props.children || null}
      </div>
    );
  }
}

class App extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <Router history={hashHistory}>
          <Route
            path="/"
            component={AppComponent}
          >
            <IndexRedirect to="/welcome" />
            <Route path="/welcome" component={Welcome}>
            </Route>
          </Route>
        </Router>
      </div>
    );
  }
}

if (typeof document !== 'undefined') {
  render(
    <App/>,
    document.getElementById('app')
  );
}

// Support require.ensure
// require.ensure('../error/index', function(a){
// 	var error = require('../error/index');
// 	console.log(error);
// });