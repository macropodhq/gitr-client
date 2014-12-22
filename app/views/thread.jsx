/** @jsx React.DOM */

var React = require('react');
var Fluxxor = require('fluxxor');
var Router = require('react-router');
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var Wrapper = require('./wrapper');

var log = require('bows')('Thread View');

require('./thread.scss');

var Thread = module.exports = React.createClass({
  displayName: 'Thread',

  mixins: [
    FluxMixin,
    StoreWatchMixin('PersonStore'),
  ],

  getStateFromFlux() {
    return {};
  },

  render() {
    return (
      <Wrapper leftLink={{to: 'swipe', iconType: 'users'}}>
        <div className="Thread">
          Look at these threads. You ain`t get threads like these at Harrods.
        </div>
      </Wrapper>
    );
  }
});
