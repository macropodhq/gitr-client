/** @jsx React.DOM */

var React = require('react/addons');
var Icon = React.createClass({
  getDefaultProps: function() {
    return {
      type: 'arrow-down',
      font: true
    };
  },

  componentDidMount: function() {
    this.getDOMNode().innerHTML = require('!raw!./svgs/icon-' + this.props.type + '.svg');
  },

  render: function() {
    var component = this.props.component || React.DOM.i;
    var props = {className: 'Icon'};

    return this.transferPropsTo(component(props));
  }
});

module.exports = Icon;
