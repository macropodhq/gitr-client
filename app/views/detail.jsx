/** @jsx React.DOM */

var React = require('react');
var Fluxxor = require('fluxxor');
var Swipe = require('react-swipe/swipe');
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var Wrapper = require('./wrapper');
var Icon = require('../base/components/icon');

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
      <Wrapper leftLink={{to: 'swipe', iconType: 'nav-left'}} rightLink={{to: 'messages', iconType: 'bubble'}} heading="Conrad">
        <div className="Detail">
          <Swipe id="Detail-portfolio">
            <div className="Detail-work">
              <h2>npmrc</h2>
              <div className="Detail-work-iconography">
                <div className="Detail-work-icon">
                  <Icon type="star" font={false} /> 13
                </div>
                <div className="Detail-work-icon">
                  <Icon type="share" font={false} /> 2
                </div>
                <div className="Detail-work-icon">
                  <Icon type="users" font={false} /> 0
                </div>
              </div>
              <p>Switch between different .npmrc files with ease and grace.</p>
            </div>
            <div>asdfasdf 3</div>
            <div>asdfasdf 6</div>
          </Swipe>
        </div>
      </Wrapper>
    );
  }
});
