/** @jsx React.DOM */

var React = require('react/addons');
require('./icon.scss');

var Icon = React.createClass({
  getDefaultProps: function() {
    return {
      type: 'arrow-down',
      font: true
    };
  },

  componentDidMount: function() {
    if (!this.props.font) {
      this.getDOMNode().innerHTML = require('!raw!./svgs/icon-' + this.props.type + '.svg');
    }
  },

  render: function() {
    var component = this.props.component || React.DOM.i;
    var props = {className: 'Icon'};

    if (this.props.font) {
      props['data-am-icon'] = this.props.type;
    }

    return this.transferPropsTo(component(props));
  }
});

module.exports = Icon;
