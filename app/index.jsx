/** @jsx React.DOM */

var React = require('react');
var Router = require('react-router');
var Fluxxor = require('fluxxor');

var routes = require('./routes');
var createStores = require('./stores');
var createActions = require('./actions');

var log = require('bows')('App');
var logEvent = require('bows')('Events');

var baseUrl = 'https://api.gitr.io';
var pubnubKey = 'sub-c-404211d6-8a48-11e4-9199-02ee2ddab7fe';

var flux = new Fluxxor.Flux(createStores(), createActions(baseUrl, pubnubKey));

flux.on('dispatch', function(name, payload) {
  logEvent(name, payload.operationId, _.omit(payload, 'operationId'));
});

flux.actions.init();

Router.run(routes, (Handler, state) => {
  log('route change', state);

  React.render(<Handler flux={flux} />, document.body);
});
