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
    StoreWatchMixin('PersonStore'),
  ],

  getStateFromFlux() {
    return {};
  },

  render() {
    return (
      <div className="Onboarding">
        <h1>Anonymously “Like” or “Skip” developers Gitr suggests</h1>
        <div className="Onboarding-phone">
          <div className="Onboarding-phone-screen"></div>
        </div>
        <Router.Link to="swipe">
          <Button>Log In with GitHub</Button>
        </Router.Link>
        <h3>* Gitr doesn’t access or post to any of your repos</h3>
      </div>
    );
  }
});
