/** @jsx React.DOM */

var React = require('react');
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var Wrapper = require('./wrapper');

var log = require('bows')('Swipe View');

require('./swipe.scss');

var Swipe = module.exports = React.createClass({
  displayName: 'Swipe',

  mixins: [
    FluxMixin,
    StoreWatchMixin('PersonStore'),
  ],

  getStateFromFlux() {
    return {};
  },

  render() {
    return (
      <Wrapper>
        <div className="Swipe">
          let`s climb everest
        </div>
      </Wrapper>
    );
  }
});
