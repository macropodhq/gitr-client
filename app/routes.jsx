/** @jsx React.DOM */

var React = require('react');
var Router = require('react-router');
var Routes = Router.Routes;
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;

var log = require('bows')('Routes');

var AppView = require('./views/app');
var SwipeView = require('./views/swipe');

module.exports = (
  <Route name="app" path="/" handler={AppView}>
    <DefaultRoute handler={SwipeView} />
  </Route>
);
