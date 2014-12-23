/** @jsx React.DOM */

var React = require('react');
var Router = require('react-router');
var Routes = Router.Routes;
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;

var log = require('bows')('Routes');

var AppView = require('./views/app');
var SwipeView = require('./views/swipe');
var PersonView = require('./views/person');
var MatchesView = require('./views/matches');
var ConversationView = require('./views/conversation');

module.exports = (
  <Route name="app" path="/" handler={AppView}>
    <DefaultRoute name="swipe" handler={SwipeView} />
    <Route name="person" path="/person/:name" handler={PersonView} />
    <Route name="matches" path="/matches" handler={MatchesView} />
    <Route name="conversation" path="/matches/:id" handler={ConversationView} />
  </Route>
);
