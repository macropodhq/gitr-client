/** @jsx React.DOM */

var React = require('react');
var Fluxxor = require('fluxxor');
var Router = require('react-router');
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var moment = require('moment');
var Wrapper = require('./wrapper');
var Icon = require('../base/components/icon');

var log = require('bows')('Conversation View');

require('./conversation.scss');

var Conversation = module.exports = React.createClass({
  displayName: 'Conversation',

  mixins: [
    FluxMixin,
    StoreWatchMixin('PersonStore'),
    Router.State,
  ],

  getStateFromFlux() {
    return {};
  },

  render() {
    return (
      <Wrapper leftLink={{to: 'matches', iconType: 'nav-left'}} heading="Conrad Pancake">
        <div className="Conversation">
          <ul className="Conversation-messages">
            <li className="Conversation-message Conversation-message--me">
              <img src="https://avatars1.githubusercontent.com/u/479055" />
              <span className="Conversation-message-copy">
                <p>Hey</p>
                <span className="Conversation-message-time">{moment().format('ddd h:mma')}</span>
              </span>
            </li>
            <li className="Conversation-message Conversation-message--them">
              <img src="https://avatars0.githubusercontent.com/u/33324" />
              <span className="Conversation-message-copy">
                <p>Hey</p>
                <span className="Conversation-message-time">{moment().format('ddd h:mma')}</span>
              </span>
            </li>

            <li className="Conversation-message Conversation-message--them">
              <img src="https://avatars0.githubusercontent.com/u/33324" />
              <span className="Conversation-message-copy">
                <p>How are you doing?</p>
                <span className="Conversation-message-time">{moment().format('ddd h:mma')}</span>
              </span>
            </li>

            <li className="Conversation-message Conversation-message--me">
              <img src="https://avatars1.githubusercontent.com/u/479055" />
              <span className="Conversation-message-copy">
                <p>I would hear stories about Steve Jobs and feel like he was at 100 percent exactly what he wanted to do, but I`m sure even a Steve Jobs has compromised. Even a Rick Owens has compromised. You know, even a Kanye West has compromised. Sometimes you don`t even know when you`re being compromised till after the fact, and that`s what you regret.</p>
                <span className="Conversation-message-time">{moment().format('ddd h:mma')}</span>
              </span>
            </li>

            <li className="Conversation-message Conversation-message--them">
              <img src="https://avatars0.githubusercontent.com/u/33324" />
              <span className="Conversation-message-copy">
                <p>But for me to have the opportunity to stand in front of a bunch of executives and present myself, I had to hustle in my own way. I can`t tell you how frustrating it was that they didn`t get that. No joke - I`d leave meetings crying all the time.</p>
                <span className="Conversation-message-time">{moment().format('ddd h:mma')}</span>
              </span>
            </li>

            <li className="Conversation-message Conversation-message--them">
              <img src="https://avatars0.githubusercontent.com/u/33324" />
              <span className="Conversation-message-copy">
                <p>The concept of commercialism in the fashion and art world is looked down upon. You know, just to think, `What amount of creativity does it take to make something that masses of people like?` And, `How does creativity apply across the board?`</p>
                <span className="Conversation-message-time">{moment().format('ddd h:mma')}</span>
              </span>
            </li>
          </ul>

          <div className="Conversation-add">
            <input type="text" className="Conversation-input" placeholder="Send a message" />
            <Icon className="Conversation-add-submit" type="nav-right" font={false}/>
          </div>
        </div>
      </Wrapper>
    );
  }
});
