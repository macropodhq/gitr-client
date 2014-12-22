/** @jsx React.DOM */

var React = require('react');
var Router = require('react-router');
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
    StoreWatchMixin('SuggestionStore'),
  ],

  getStateFromFlux() {
    var SuggestionStore = this.getFlux().store('SuggestionStore');

    if (SuggestionStore.length() === 0 && SuggestionStore.isLoading === false) {
      this.getFlux().actions.peopleFetch();
    }

    var list = SuggestionStore.peek(3);

    return {
      first: list[0],
      list: list.slice(1),
    };
  },

  getInitialState() {
    return {
      gesture: {
        pageX: 0,
        pageXOrigin: 0,
        directionOrigin: 'none',
        direction: 'none'
      }
    }
  },

  componentDidMount() {
    this.minToAccept = (window.innerWidth / 2) - 40;
    this.thresholdToStart = 20;
  },

  handleTouchStart(event) {
    if (event.touches.length == 1){ // Only deal with one finger
      var touch = event.touches[0]; // Get the information for finger #1

      this.setState({
        gesture: {
          direction: 'none',
          directionOrigin: 'none',
          pageXOrigin: touch.pageX,
          pageX: touch.pageX
        }
      })
    }
  },

  handleTouchMove(event) {
    var gesture = this.state.gesture;

    if (event.touches.length == 1){ // Only deal with one finger
      var touch = event.touches[0]; // Get the information for finger #1

      var direction = 'none';
      var directionOrigin = 'none';

      if (touch.pageX < this.state.gesture.pageX) {
        direction = 'left';
      }

      if (touch.pageX > this.state.gesture.pageX) {
        direction = 'right';
      }

      if (touch.pageX < this.state.gesture.pageXOrigin) {
        directionOrigin = 'left';
      }

      if (touch.pageX > this.state.gesture.pageXOrigin) {
        directionOrigin = 'right';
      }

      if (touch.pageX !== gesture.pageX) {
        gesture.pageX = touch.pageX;
        gesture.direction = direction;
      }

      if (directionOrigin !== gesture.directionOrigin) {
        gesture.directionOrigin = directionOrigin;
      }

      this.setState({
        gesture: gesture
      });
    }
  },

  handleTouchEnd(event) {
    if (this.getAcceptanceStatus() > 1) {
      this.handleChoice(true);
    }

    if (this.getAcceptanceStatus() < -1) {
      this.handleChoice(false);
    }

    this.setState({
      gesture: {
        pageX: 0,
        pageXOrigin: 0,
        directionOrigin: 'none',
        direction: 'none'
      }
    })
  },

  getRotation() {
    var initialX = this.state.gesture.pageXOrigin;
    var currentX = this.state.gesture.pageX;
    var maxX = window.innerWidth;
    var maxRotation = 50;
    var movementX = this.state.gesture.direction === 'right' ? currentX - initialX : initialX - currentX;
    if (movementX < 0) {
      movementX = movementX * -1;
    }

    var rotation = (maxRotation / maxX) * movementX;
    rotation = this.state.gesture.directionOrigin === 'left' ? rotation : rotation * -1;
    return rotation;
  },

  getTranslation() {
    var maxY = 200;
    var initialX = this.state.gesture.pageXOrigin;
    var currentX = this.state.gesture.pageX;
    var movementX = this.state.gesture.directionOrigin === 'right' ? currentX - initialX : initialX - currentX;
    movementX = this.state.gesture.directionOrigin === 'right' ? movementX : movementX * -1;
    movementY = (maxY / window.innerWidth) * movementX;
    movementY = movementY < 0 ? movementY * -1 : movementY;
    return movementX + 'px, ' + movementY + 'px';
  },

  getAcceptanceStatus() {
    var initialX = this.state.gesture.pageXOrigin;
    var currentX = this.state.gesture.directionOrigin === 'right'  ? this.state.gesture.pageX - this.thresholdToStart : this.state.gesture.pageX + this.thresholdToStart;
    var totalDrag = this.state.gesture.directionOrigin === 'right' ? currentX - initialX : initialX - currentX;
    totalDrag = this.state.gesture.directionOrigin === 'right' ? totalDrag : totalDrag * -1;
    var progress = totalDrag / this.minToAccept;

    return progress;
  },

  handleChoice(match) {
    this.getFlux().actions.matchCreate({
      person: this.state.first,
      match: match,
    });

    this.getFlux().store('SuggestionStore').shift();
  },

  render() {
    var style = {
      'transform': 'rotate(' + this.getRotation() + 'deg) translate(' + this.getTranslation() + ')'
    };

    var color = 'black';

    if (this.getAcceptanceStatus() > 1) {
      color = 'green';
    }

    if (this.getAcceptanceStatus() < -1) {
      color = 'red';
    }

    var statusStyle = {
      'opacity': this.state.gesture.directionOrigin === 'right' ? this.getAcceptanceStatus() : this.getAcceptanceStatus() * -1,
      'color': color
    }

    var cx = React.addons.classSet;
    var statusClass = cx({
      'Swipe-status': true,
      'Swipe-status--no': this.state.gesture.directionOrigin === 'left',
      'Swipe-status--yes': this.state.gesture.directionOrigin === 'right'
    });

    return (
      <Wrapper rightLink={{to: 'messages', iconType: 'bubble'}}>
        <div className="Swipe">
          <div className="Swipe-cards">
            { this.state.first &&
              <div className="Swipe-card" style={style} onTouchStart={this.handleTouchStart} onTouchEnd={this.handleTouchEnd} onTouchMove={this.handleTouchMove}>
                <div className="Swipe-card-image" style={{'background-image': 'url(' + this.state.first.avatar_url + ')'}}></div>
                <div className="Swipe-card-details">
                  <h4>{'@' + this.state.first.login}</h4>
                  <div className="Swipe-card-details-icons">
                    icons?
                  </div>
                </div>
                <div className={statusClass} style={statusStyle}>{this.getAcceptanceStatus() > 0 ? '✓' : '×'}</div>
              </div>
            }

            { (this.state.list.length > 0) &&
              <div className="Swipe-card-next">
                <div className="Swipe-card-image" style={{'background-image': 'url(' + this.state.list[0].avatar_url + ')'}}></div>
                <div className="Swipe-card-details">
                  <h4>{'@' + this.state.list[0].login}</h4>
                  <div className="Swipe-card-details-icons">
                    icons?
                  </div>
                </div>
              </div>
            }
          </div>

          <div className="Swipe-controls">
            <div className="Swipe-control Swipe-control--no" onClick={this.handleChoice.bind(null, false)} disabled={(this.state.first === null)}>×</div>
            <Router.Link className="Swipe-control Swipe-control--info" to="detail">i</Router.Link>
            <div className="Swipe-control Swipe-control--yes" onClick={this.handleChoice.bind(null, true)} disabled={(this.state.first === null)}>✓</div>
          </div>
        </div>
      </Wrapper>
    );
  }
});
