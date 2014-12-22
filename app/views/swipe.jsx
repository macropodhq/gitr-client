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
          <div className="Swipe-cards">
            <div className="Swipe-card">
              <img src="https://avatars1.githubusercontent.com/u/479055" />
              <h4>Conrad Pankoff</h4>
            </div>
          </div>
        </div>
      </Wrapper>
    );
  }
});
