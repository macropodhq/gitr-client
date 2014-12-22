/** @jsx React.DOM */

var React = require('react');
var Fluxxor = require('fluxxor');
var Router = require('react-router');
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Button = require('../base/components/button');

var log = require('bows')('Onboarding View');

require('./onboarding.scss');

var Onboarding = module.exports = React.createClass({
  displayName: 'Onboarding',

  mixins: [
    FluxMixin,
    StoreWatchMixin('PersonStore', 'LoginStore'),
  ],

  getStateFromFlux() {
    var LoginStore = this.getFlux().store('LoginStore');

    return {
      loading: LoginStore.isLoading,
    };
  },

  handleLoginClick() {
    this.getFlux().actions.login(this.props.githubClientToken);
  },

  render() {
    return (
      <div className="Onboarding">
        <h1>Anonymously “Like” or “Skip” developers Gitr suggests</h1>
        <div className="Onboarding-phone">
          <div className="Onboarding-phone-screen"></div>
        </div>
        <Router.Link to="swipe">
          <Button disabled={this.state.loading} onClick={this.handleLoginClick}>Log In with GitHub</Button>
        </Router.Link>
        <h3>* Gitr doesn’t access or post to any of your repos</h3>
      </div>
    );
  }
});
