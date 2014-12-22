/** @jsx React.DOM */

var React = require('react');
var Router = require('react-router');
var Fluxxor = require('fluxxor');

var routes = require('./routes');
var createStores = require('./stores');
var createActions = require('./actions');

var log = require('bows')('App');
var logEvent = require('bows')('Events');

var baseUrl = 'http://api.gitr.io/v1';
var githubClientToken = '6fb60d94f985f1522e10';

var flux = new Fluxxor.Flux(createStores(), createActions(baseUrl));

flux.on('dispatch', function(name, payload) {
  logEvent(name, payload.operationId, _.omit(payload, 'operationId'));
});

Router.run(routes, (Handler, state) => {
  log('route change', state);

  React.render(<Handler flux={flux} githubClientToken={githubClientToken} />, document.body);
});
