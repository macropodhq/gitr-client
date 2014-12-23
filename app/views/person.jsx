/** @jsx React.DOM */

var React = require('react');
var Fluxxor = require('fluxxor');
var Swipe = require('react-swipe/swipe');
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var Router = require('react-router');
var Wrapper = require('./wrapper');
var Icon = require('../base/components/icon');
var Spinner = require('react-spinner');

var log = require('bows')('Person View');

require('./person.scss');

var Person = module.exports = React.createClass({
  displayName: 'Person',

  mixins: [
    FluxMixin,
    StoreWatchMixin('PersonStore'),
    Router.State,
    Router.Navigation
  ],

  getStateFromFlux() {
    var PersonStore = this.getFlux().store('PersonStore');

    return {
      person: PersonStore.get(this.getParams().id),
      originalRepos: PersonStore.get(this.getParams().id) ? PersonStore.get(this.getParams().id).repos : []
    };
  },

  getInitialState() {
    return {
      slide: {
        currentIndex: 0
      }
    }
  },

  componentDidMount() {
    this.getFlux().actions.personFetch(this.getParams().id);
  },

  handleSwipe(index) {
    this.setState({
      slide: {
        currentIndex: index
      }
    })
  },

  work(repo) {
    return (
      <div className="Detail-work">
        <div className="Detail-work-inside">
          <h2>{repo.name}</h2>
          <div className="Detail-work-iconography">
            <div className="Detail-work-icon">
              {repo.language ? repo.language : 'Unknown'}
            </div>
            <div className="Detail-work-icon">
              <Icon type="eye" font={false} /> {repo.watchers}
            </div>
            <div className="Detail-work-icon">
              <Icon type="share" font={false} /> {repo.forks}
            </div>
          </div>
          <p>{repo.description}</p>
        </div>
      </div>
    );
  },

  handleChoice(match) {
    this.getFlux().actions.matchCreate({}, {
      person: this.state.person,
      match: match,
    });

    this.getFlux().store('SuggestionStore').shift();

    this.transitionTo('swipe');
  },

  handleSwipeNav(index) {
    var person = this.state.person;
    var repos = this.state.originalRepos;
    var firstHalf = repos.slice(0, index);
    var lastHalf = repos.slice(index, repos.length);
    repos = lastHalf.concat(firstHalf);
    person.repos = repos;

    this.setState({
      person: person,
      slide: {
        currentIndex: index
      }
    })
  },

  render() {
    var panes = Array.apply(null, Array(20)).map(function(_, i) {
      return React.DOM.div({key: i}, React.DOM.b(null, i))
    });

    var PersonStore = this.getFlux().store('PersonStore');

    if (!this.state.person && PersonStore.isLoading) {
      return (
        <Wrapper leftLink={{to: 'matches', iconType: 'nav-left'}} heading={'loading'}>
          <Spinner />
        </Wrapper>
      );
    }

    if (!this.state.person && !PersonStore.isLoading) {
      return (
        <h1>Not found!</h1>
      );
    }

    return (
      <Wrapper leftLink={{to: 'swipe', iconType: 'nav-left'}} showYesNo={true} heading={'@' + this.state.person.login} onNo={this.handleChoice.bind(null, false)} onYes={this.handleChoice.bind(null, true)}>
        <div className="Detail">
          <Swipe className="Detail-portfolio" callback={this.handleSwipe}>
            {this.state.person.repos.map(function(repo) {
              return (
                this.work(repo)
              )
            }.bind(this))}
          </Swipe>
          <div className="Detail-portfolio-pagination">
            {this.state.person.repos.map(function(repo, index) {
              return (
                <span onClick={this.handleSwipeNav.bind(null, index)} className={'Detail-portfolio-pagination-page' + (this.state.slide.currentIndex === index ? ' Detail-portfolio-pagination-page--active' : ' ')}></span>
              )
            }.bind(this))}
          </div>
        </div>
      </Wrapper>
    );
  }
});
