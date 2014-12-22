/** @jsx React.DOM */

var React = require('react');
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
    StoreWatchMixin('PersonStore'),
  ],

  getStateFromFlux() {
    return {};
  },

  getInitialState: function() {
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

  handleTouchStart: function(event) {
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

  handleTouchMove: function(event) {
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

  handleTouchEnd: function(event) {
    if (this.getAcceptanceStatus() > 1) {
      this.handleYes();
    }

    if (this.getAcceptanceStatus() < -1) {
      this.handleNo();
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

  getRotation: function() {
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

  getTranslation: function() {
    var maxY = 200;
    var initialX = this.state.gesture.pageXOrigin;
    var currentX = this.state.gesture.pageX;
    var movementX = this.state.gesture.directionOrigin === 'right' ? currentX - initialX : initialX - currentX;
    movementX = this.state.gesture.directionOrigin === 'right' ? movementX : movementX * -1;
    movementY = (maxY / window.innerWidth) * movementX;
    movementY = movementY < 0 ? movementY * -1 : movementY;
    return movementX + 'px, ' + movementY + 'px';
  },

  getAcceptanceStatus: function() {
    var initialX = this.state.gesture.pageXOrigin;
    var currentX = this.state.gesture.directionOrigin === 'right'  ? this.state.gesture.pageX - this.thresholdToStart : this.state.gesture.pageX + this.thresholdToStart;
    var totalDrag = this.state.gesture.directionOrigin === 'right' ? currentX - initialX : initialX - currentX;
    totalDrag = this.state.gesture.directionOrigin === 'right' ? totalDrag : totalDrag * -1;
    var progress = totalDrag / this.minToAccept;

    return progress;
  },

  handleYes: function() {
    alert('Yeah, you love em')
  },

  handleNo: function() {
    alert('Haters gunna hate hate hate');
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
      <Wrapper>
        <div className="Swipe">
          <div className="Swipe-cards">
            <div className="Swipe-card" style={style} onTouchStart={this.handleTouchStart} onTouchEnd={this.handleTouchEnd} onTouchMove={this.handleTouchMove}>
              <div className="Swipe-card-image" style={{'background-image': 'url(https://avatars1.githubusercontent.com/u/479055)'}}></div>
              <div className="Swipe-card-details">
                <h4>Conrad Pankoff</h4>
                <div className="Swipe-card-details-icons">
                  icons?
                </div>
              </div>
              <div className={statusClass} style={statusStyle}>{this.getAcceptanceStatus() > 0 ? '✓' : '×'}</div>
            </div>

            <div className="Swipe-card-next">
              <div className="Swipe-card-image" style={{'background-image': 'url(https://avatars2.githubusercontent.com/u/2898239)'}}></div>
              <div className="Swipe-card-details">
                <h4>James Coleman</h4>
                <div className="Swipe-card-details-icons">
                  icons?
                </div>
              </div>
            </div>
          </div>

          <div className="Swipe-controls">
            <div className="Swipe-control Swipe-control--no" onClick={this.handleNo}>×</div>
            <div className="Swipe-control Swipe-control--info">i</div>
            <div className="Swipe-control Swipe-control--yes" onClick={this.handleYes}>✓</div>
          </div>
        </div>
      </Wrapper>
    );
  }
});
