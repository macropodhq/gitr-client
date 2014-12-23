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
    StoreWatchMixin('PersonStore'),
    Router.State,
  ],

  getStateFromFlux() {
    return {};
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

  render() {
    var panes = Array.apply(null, Array(20)).map(function(_, i) {
      return React.DOM.div({key: i}, React.DOM.b(null, i))
    });

    console.log(this.getParams())

    var personStore = this.getFlux().store('PersonStore');
    console.log(personStore.getBy({id: this.getParams().id}))

    var repos = [1,2,3];

    return (
      <Wrapper leftLink={{to: 'swipe', iconType: 'nav-left'}} rightLink={{to: 'matches', iconType: 'bubbles'}} heading="Conrad">
        <div className="Detail">
          <Swipe id="Detail-portfolio" callback={this.handleSwipe}>
            <div className="Detail-work">
              <div className="Detail-work-inside">
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
            </div>
            <div className="Detail-work">
              <div className="Detail-work-inside">
                <h2>2</h2>
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
            </div>
            <div className="Detail-work">
              <div className="Detail-work-inside">
                <h2>3</h2>
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
            </div>
          </Swipe>
          <div className="Detail-portfolio-pagination">
            { repos.map(function(repo, index) {
              console.log('rendering')
              console.log({
                index: index,
                currentIndex: this.state.slide.currentIndex
              })
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
