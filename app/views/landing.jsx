/** @jsx React.DOM */

var React = require('react');
var Fluxxor = require('fluxxor');
var Router = require('react-router');
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Button = require('../base/components/button');

var log = require('bows')('Landing View');

require('./landing.scss');

var imagePhone = require("url?mimetype=image/png!../images/phone.png");
var imageMacropodLogo = require("url?mimetype=image/png!../images/macropod-logo.png");

var Landing = module.exports = React.createClass({
  displayName: 'Landing',

  mixins: [
    FluxMixin,
    StoreWatchMixin('PersonStore', 'LoginStore'),
  ],

  getStateFromFlux() {
    var LoginStore = this.getFlux().store('LoginStore');

    return {
      loading: LoginStore.isLoading,
    };
  },

  handleLoginClick() {
    this.getFlux().actions.login(this.props.githubClientToken);
  },

  render() {
    return (
      <div className="Landing">
        <div className="Masthead">
          <div className="Masthead-content">
            <div className="Masthead-copy">
              <h1 className="Masthead-title">gitr</h1>
              <h2 className="Masthead-slogan">It’s how developers meet.</h2>
              <Router.Link to="swipe">
                <Button disabled={this.state.loading} onClick={this.handleLoginClick} className="Masthead-callToAction">Log In with GitHub</Button>
              </Router.Link>
            </div>
            <img src={imagePhone} className="Masthead-image" />
          </div>
        </div>
        <div className="Footer">
          <img src={imageMacropodLogo} className="Footer-logo" />
          <a href="#">Macropod Software</a>
        </div>
      </div>
    );
  }
});
