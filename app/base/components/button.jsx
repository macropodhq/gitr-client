/** @jsx React.DOM */

require('./button.scss');

var React = require('react');

var Button = React.createClass({
  getDefaultProps: function() {
    return {
      type: 'default'
    };
  },

  render: function() {
    var buttonClass = 'Button Button--' + this.props.type;

    return (
      this.transferPropsTo(<button className={buttonClass}>{this.props.children}</button>)
    );
  }
});

module.exports = Button;
