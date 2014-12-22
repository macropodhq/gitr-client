/** @jsx React.DOM */

var React = require('react');
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var Wrapper = require('./wrapper');

var log = require('bows')('Detail View');

require('./detail.scss');

var Detail = module.exports = React.createClass({
  displayName: 'Detail',

  mixins: [
    FluxMixin,
    StoreWatchMixin('PersonStore'),
  ],

  getStateFromFlux() {
    return {};
  },

  render() {
    return (
      <Wrapper leftLink={{to: 'swipe', iconType: 'nav-left'}}>
        <div className="Detail">
          <h1>Conrad Pancake</h1>
        </div>
      </Wrapper>
    );
  }
});
