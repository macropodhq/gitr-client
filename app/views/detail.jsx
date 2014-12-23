/** @jsx React.DOM */

var React = require('react');
var Fluxxor = require('fluxxor');
var Swipe = require('react-swipe/swipe');
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

    var panes = Array.apply(null, Array(20)).map(function(_, i) {
      return React.DOM.div({key: i}, React.DOM.b(null, i))
    })

    return (
      <Wrapper leftLink={{to: 'swipe', iconType: 'nav-left'}} rightLink={{to: 'messages', iconType: 'bubble'}}>
        <div className="Detail">
          <h1>Conrad Pancake</h1>
          <Swipe id="Swipez">
            <div>asdfasdf</div>
            <div>asdfasdf 3</div>
            <div>asdfasdf 6</div>
          </Swipe>
        </div>
      </Wrapper>
    );
  }
});
