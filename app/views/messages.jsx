/** @jsx React.DOM */

var React = require('react');
var Fluxxor = require('fluxxor');
var Router = require('react-router');
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var Wrapper = require('./wrapper');
var Icon = require('../base/components/icon');

var log = require('bows')('Messages View');

require('./messages.scss');

var Messages = module.exports = React.createClass({
  displayName: 'Messages',

  mixins: [
    FluxMixin,
    StoreWatchMixin('PersonStore'),
  ],

  getStateFromFlux() {
    return {};
  },

  render() {
    return (
      <Wrapper leftLink={{to: 'swipe', iconType: 'nav-left'}} heading="Messages">
        <div className="Messages">
          <ul className="Messages-users">
            <li>
              <Router.Link to="thread" params={{userId: 1}}>
                <Icon type="nav-right" font={false} />
                <img src="https://avatars1.githubusercontent.com/u/479055" />
                <h2>Conrad Pancake</h2>
              </Router.Link>
            </li>
            <li>
              <Router.Link to="messages">
                <Icon type="nav-right" font={false} />
                <img src="https://avatars0.githubusercontent.com/u/33324" />
                <h2>Nathan coffeeface</h2>
              </Router.Link>
            </li>
            <li>
              <Router.Link to="messages">
                <Icon type="nav-right" font={false} />
                <img src="https://avatars0.githubusercontent.com/u/33324" />
                <h2>Nathan coffeeface</h2>
              </Router.Link>
            </li>
            <li>
              <Router.Link to="messages">
                <Icon type="nav-right" font={false} />
                <img src="https://avatars0.githubusercontent.com/u/33324" />
                <h2>Nathan coffeeface</h2>
              </Router.Link>
            </li>
            <li>
              <Router.Link to="messages">
                <Icon type="nav-right" font={false} />
                <img src="https://avatars0.githubusercontent.com/u/33324" />
                <h2>Nathan coffeeface</h2>
              </Router.Link>
            </li>
            <li>
              <Router.Link to="messages">
                <Icon type="nav-right" font={false} />
                <img src="https://avatars0.githubusercontent.com/u/33324" />
                <h2>Nathan coffeeface</h2>
              </Router.Link>
            </li>
          </ul>
        </div>
      </Wrapper>
    );
  }
});
