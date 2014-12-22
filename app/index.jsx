/** @jsx React.DOM */

var React = require('react');
var Router = require('react-router');
var Fluxxor = require('fluxxor');
var defaults = require('superagent-defaults');

var routes = require('./routes');
var createStores = require('./stores');
var createActions = require('./actions');

var log = require('bows')('App');

var startApp = function startApp(baseUrl, token) {
  var authorisedAgent = defaults().set('authorization', 'Bearer ' + token);

  var flux = new Fluxxor.Flux(createStores(), createActions(authorisedAgent, baseUrl));

  Router.run(routes, (Handler, state) => {
    log('route change', state);

    React.render(<Handler flux={flux} />, document.body);
  });
};

startApp('https://api.gitr.io/api/v1', 'not a real token');
