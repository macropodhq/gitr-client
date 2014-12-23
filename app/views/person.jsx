/** @jsx React.DOM */

var React = require('react');
var Fluxxor = require('fluxxor');
var Swipe = require('react-swipe/swipe');
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var Router = require('react-router');
var Wrapper = require('./wrapper');
var Icon = require('../base/components/icon');

var log = require('bows')('Person View');

require('./person.scss');

var Person = module.exports = React.createClass({
  displayName: 'Person',

  mixins: [
    FluxMixin,
    StoreWatchMixin('SuggestionStore'),
    Router.State,
  ],

  getStateFromFlux() {
    var SuggestionStore = this.getFlux().store('SuggestionStore');
    return {
      name: SuggestionStore.get(this.getParams().id) ? SuggestionStore.get(this.getParams().id).name : 'User',
      login: SuggestionStore.get(this.getParams().id) ? SuggestionStore.get(this.getParams().id).login : 'Gitr',
      repos: SuggestionStore.get(this.getParams().id) ? SuggestionStore.get(this.getParams().id).repos : []
    };
  },

  getInitialState() {
    return {
      slide: {
        currentIndex: 0
      }
    }
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

  render() {
    var panes = Array.apply(null, Array(20)).map(function(_, i) {
      return React.DOM.div({key: i}, React.DOM.b(null, i))
    });

    return (
      <Wrapper leftLink={{to: 'swipe', iconType: 'nav-left'}} rightLink={{to: 'matches', iconType: 'bubbles'}} heading={'@' + this.state.login}>
        <div className="Detail">
          <Swipe id="Detail-portfolio" callback={this.handleSwipe}>
            { this.state.repos.map(function(repo) {
                return (
                  this.work(repo)
                )
              }.bind(this))
            }
          </Swipe>
          <div className="Detail-portfolio-pagination">
            { this.state.repos.map(function(repo, index) {
                return (
                  <span className={'Detail-portfolio-pagination-page' + (this.state.slide.currentIndex === index ? ' Detail-portfolio-pagination-page--active' : ' ')}></span>
                )
              }.bind(this))
            }
          </div>
        </div>
      </Wrapper>
    );
  }
});
