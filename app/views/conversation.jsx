/** @jsx React.DOM */

var React = require('react');
var Fluxxor = require('fluxxor');
var Router = require('react-router');
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var moment = require('moment');
var Wrapper = require('./wrapper');
var Icon = require('../base/components/icon');
var Spinner = require('react-spinner');

var log = require('bows')('Conversation View');

require('./conversation.scss');

var Conversation = module.exports = React.createClass({
  displayName: 'Conversation',

  mixins: [
    FluxMixin,
    StoreWatchMixin('MatchStore', 'MessageStore'),
    Router.State,
  ],

  getStateFromFlux() {
    var MatchStore = this.getFlux().store('MatchStore');
    var MessageStore = this.getFlux().store('MessageStore');

    return {
      match: MatchStore.get(this.getParams().id),
      messages: MessageStore.getByMatchId(this.getParams().id),
    };
  },

  getInitialState() {
    return {
      message: '',
    };
  },

  componentDidMount() {
    this.getFlux().actions.matchFetch(this.getParams().id);
  },

  handleChange(ev) {
    ev.preventDefault();
    ev.stopPropagation();

    this.setState({
      message: ev.target.value,
    });
  },

  handleSubmit(ev) {
    ev.preventDefault();
    ev.stopPropagation();

    this.getFlux().actions.messageCreate({id: this.state.match.id}, {text: this.state.message});

    this.setState({
      message: '',
    });
  },

  render() {
    if (!this.state.match) {
      return (
        <Wrapper leftLink={{to: 'matches', iconType: 'nav-left'}} heading={'loading'}>
          <Spinner />
          <form onSubmit={this.handleSubmit}>
            <div className="Conversation-add">
              <input type="text" className="Conversation-input" placeholder="Send a message" value={this.state.message} onChange={this.handleChange} />
              <Icon className="Conversation-add-submit" type="nav-right" font={false}/>
            </div>
          </form>
        </Wrapper>
      )
    }

    var self = this;

    return (
      <Wrapper leftLink={{to: 'matches', iconType: 'nav-left'}} heading={'@' + this.state.match.login}>
        <div className="Conversation">
          <ul className="Conversation-messages">
            {this.state.messages.map(function(message) {
              var from = (message.from === self.state.match.id) ? "them" : "me";

              return (
                <li className={'Conversation-message Conversation-message--' + from}>
                  <img src="https://avatars1.githubusercontent.com/u/479055" />
                  <span className="Conversation-message-copy">
                    <p>{message.text}</p>
                    <span className="Conversation-message-time">{moment().format('ddd h:mma')}</span>
                  </span>
                </li>
              );
            })}
          </ul>

          <form onSubmit={this.handleSubmit}>
            <div className="Conversation-add">
              <input type="text" className="Conversation-input" placeholder="Send a message" value={this.state.message} onChange={this.handleChange} />
              <Icon className="Conversation-add-submit" type="nav-right" font={false}/>
            </div>
          </form>
        </div>
      </Wrapper>
    );
  }
});
