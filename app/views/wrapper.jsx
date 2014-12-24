/** @jsx React.DOM */

var React = require('react');
var Router = require('react-router');
var Icon = require('../base/components/icon');

var log = require('bows')('Wrapper View');

require('./app.scss');

var Wrapper = module.exports = React.createClass({
  displayName: 'Wrapper',

  getDefaultProps() {
    return {
      onNo: function() {},
      onYes: function() {}
    }
  },

  getLeftButton() {
    if (this.props.leftLink) {
      return (
        <Router.Link
          to={this.props.leftLink.to}
          params={this.props.leftLink.params || {}}
        >
          <Icon type={this.props.leftLink.iconType} font={false}/>
        </Router.Link>
      );
    } else {
      return;
    }
  },

  getRightButton() {
    if (this.props.rightLink) {
      return (
        <Router.Link
          to={this.props.rightLink.to}
          params={this.props.rightLink.params || {}}
        >
          <Icon type={this.props.rightLink.iconType} font={false}/>
        </Router.Link>
      );
    } else {
      return;
    }
  },

  render() {
    var newNotifications = true;
    var cx = React.addons.classSet;
    var classes = cx({
      'App-nav-item': true,
      'App-nav-item--right': true,
      'App-nav-item--notification': newNotifications && (this.props.rightLink && this.props.rightLink.to) === 'matches'
    });

    return (
      <div className="App">
        <header>
          <nav className="App-nav">
            <div className="App-nav-item">
              {this.getLeftButton()}
            </div>
            <h1>{this.props.heading || 'gitr'}</h1>
            <div className={classes}>
              {this.getRightButton()}
              { this.props.showYesNo &&
                  <div>
                    <Icon className="Icon-close" type="close" font={false} onClick={this.props.onNo}/>
                    <Icon className="Icon-check" type="check" font={false} onClick={this.props.onYes}/>
                  </div>
              }
            </div>
          </nav>
        </header>

        <div className="App-content">
          {this.props.children}
        </div>
      </div>
    );
  }
});
