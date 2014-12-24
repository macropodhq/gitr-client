/** @jsx React.DOM */

var React = require('react');
var Fluxxor = require('fluxxor');
var Router = require('react-router');
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var Wrapper = require('./wrapper');
var Icon = require('../base/components/icon');
var Spinner = require('react-spinner');

var log = require('bows')('Matches View');

require('./matches.scss');

var Matches = module.exports = React.createClass({
  displayName: 'Matches',

  mixins: [
    FluxMixin,
    StoreWatchMixin('MatchStore'),
  ],

  getStateFromFlux() {
    var MatchStore = this.getFlux().store('MatchStore');

    return {
      matches: MatchStore.getAll(),
    };
  },

  componentDidMount() {
    this.getFlux().actions.matchesFetch();
  },

  render() {
    var MatchStore = this.getFlux().store('MatchStore');

    if (MatchStore.isLoading) {
      return (
        <Wrapper leftLink={{to: 'matches', iconType: 'nav-left'}} heading={'loading'}>
          <Spinner />
        </Wrapper>
      );
    }

    return (
      <Wrapper leftLink={{to: 'swipe', iconType: 'nav-left'}} heading="Matches">
        <div className="Matches">
          <ul className="Matches-users">
            {this.state.matches.map(function(match) {
              return (
                <li>
                  <Router.Link to="conversation" params={{id: match.id || "what how"}}>
                    <Icon type="nav-right" font={false} />
                    <img src={match.avatarUrl} />
                    <h2>{'@' + match.login}</h2>
                  </Router.Link>
                </li>
              );
            })}
          </ul>
        </div>
      </Wrapper>
    );
  }
});
