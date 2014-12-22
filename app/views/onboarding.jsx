/** @jsx React.DOM */

var React = require('react');
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

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
        onboard your face
      </div>
    );
  }
});
