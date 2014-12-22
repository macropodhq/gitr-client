/** @jsx React.DOM */

var React = require('react');
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var Router = require('react-router');

var log = require('bows')('App View');

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

  handleLoginClick() {
    this.getFlux().actions.login(this.props.githubClientToken);
  },

  render() {
    if (!this.state.jwt || !this.state.profile) {
      return (
        <button onClick={this.handleLoginClick}>Login</button>
      );
    }

    return (
      <Router.RouteHandler {...this.props} />
    );
  }
});
