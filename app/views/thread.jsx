/** @jsx React.DOM */

var React = require('react');
var Fluxxor = require('fluxxor');
var Router = require('react-router');
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var Wrapper = require('./wrapper');
var Icon = require('../base/components/icon');

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
      <Wrapper leftLink={{to: 'messages', iconType: 'nav-left'}} heading="Conrad Pancake">
        <div className="Thread">
          <ul className="Thread-messages">
            <li className="Thread-message Thread-message--me">
              <img src="https://avatars1.githubusercontent.com/u/479055" />
              <span className="Thread-message-copy">
                <p>Hey</p>
                <span className="Thread-message-time">Mon 3:08pm</span>
              </span>
            </li>
            <li className="Thread-message Thread-message--them">
              <img src="https://avatars0.githubusercontent.com/u/33324" />
              <span className="Thread-message-copy">
                <p>Hey</p>
                <span className="Thread-message-time">Mon 3:08pm</span>
              </span>
            </li>

            <li className="Thread-message Thread-message--them">
              <img src="https://avatars0.githubusercontent.com/u/33324" />
              <span className="Thread-message-copy">
                <p>How are you doing?</p>
                <span className="Thread-message-time">Mon 3:09pm</span>
              </span>
            </li>

            <li className="Thread-message Thread-message--me">
              <img src="https://avatars1.githubusercontent.com/u/479055" />
              <span className="Thread-message-copy">
                <p>I would hear stories about Steve Jobs and feel like he was at 100 percent exactly what he wanted to do, but I`m sure even a Steve Jobs has compromised. Even a Rick Owens has compromised. You know, even a Kanye West has compromised. Sometimes you don`t even know when you`re being compromised till after the fact, and that`s what you regret.</p>
                <span className="Thread-message-time">Mon 3:24pm</span>
              </span>
            </li>

            <li className="Thread-message Thread-message--them">
              <img src="https://avatars0.githubusercontent.com/u/33324" />
              <span className="Thread-message-copy">
                <p>But for me to have the opportunity to stand in front of a bunch of executives and present myself, I had to hustle in my own way. I can`t tell you how frustrating it was that they didn`t get that. No joke - I`d leave meetings crying all the time.</p>
                <span className="Thread-message-time">Mon 3:08pm</span>
              </span>
            </li>

            <li className="Thread-message Thread-message--them">
              <img src="https://avatars0.githubusercontent.com/u/33324" />
              <span className="Thread-message-copy">
                <p>The concept of commercialism in the fashion and art world is looked down upon. You know, just to think, `What amount of creativity does it take to make something that masses of people like?` And, `How does creativity apply across the board?`</p>
                <span className="Thread-message-time">Mon 3:08pm</span>
              </span>
            </li>
          </ul>

          <div className="Thread-add">
            <input type="text" className="Thread-input" placeholder="Send a message" />
            <Icon className="Thread-add-submit" type="nav-right" font={false}/>
          </div>
        </div>
      </Wrapper>
    );
  }
});
