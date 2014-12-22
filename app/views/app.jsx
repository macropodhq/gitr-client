/** @jsx React.DOM */

var React = require('react');
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var Router = require('react-router');

var log = require('bows')('App View');

var Landing = require("./landing");

require('./app.scss');

var App = module.exports = React.createClass({
  displayName: 'App',

  mixins: [
    FluxMixin,
    StoreWatchMixin('LoginStore'),
  ],

  getStateFromFlux() {
    var LoginStore = this.getFlux().store('LoginStore');

    return {
      jwt: LoginStore.getJwt(),
      profile: LoginStore.getProfile(),
    };
  },

  render() {
    if (!this.state.jwt || !this.state.profile) {
      return (
        <Landing githubClientToken={this.props.githubClientToken} />
      );
    }

    return (
      <Router.RouteHandler {...this.props} />
    );
  }
});
