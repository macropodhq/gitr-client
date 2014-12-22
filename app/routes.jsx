/** @jsx React.DOM */

var React = require('react');
var Router = require('react-router');
var Routes = Router.Routes;
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;

var log = require('bows')('Routes');

var AppView = require('./views/app');
var SwipeView = require('./views/swipe');
var MessagesView = require('./views/messages');
var DetailView = require('./views/detail');
var ThreadView = require('./views/thread');

module.exports = (
  <Route name="app" path="/" handler={AppView}>
    <DefaultRoute name="swipe" handler={SwipeView}/>
    <Route name="messages" path="/messages" handler={MessagesView}/>
    <Route name="detail" path="/detail" handler={DetailView}/>
    <Route name="thread" path="/messages/thread/:userId" handler={ThreadView}/>
  </Route>
);
