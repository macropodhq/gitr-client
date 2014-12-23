'use strict';

var Fluxxor = require('fluxxor');

var log = require('bows')('Login Store');

var constants = require('../action-constants');

var LoginStore = module.exports = Fluxxor.createStore({
  initialize() {
    this.error = null;
    this.isLoading = false;
    this.doing = null;

    this.jwt = null;
    this.profile = null;

    this.bindActions(
      constants.LOGIN_PENDING, this.handleLoginPending,
      constants.LOGIN_COMPLETE, this.handleLoginComplete
    );

    log('INIT', this);
  },

  handleLoginPending() {
    this.isLoading = true;

    this.jwt = null;
    this.profile = null;

    window.localStorage.removeItem("jwt");
    window.localStorage.removeItem("profile");

    this.emit("change");
  },

  handleLoginComplete(payload) {
    log("login complete");

    this.isLoading = false;

    if (payload.error) {
      this.error = payload.error;
    } else if (payload.jwt && payload.profile) {
      this.jwt = payload.jwt;
      this.profile = payload.profile;

      window.localStorage.setItem("jwt", this.jwt);
      window.localStorage.setItem("profile", JSON.stringify(this.profile));
    }

    this.emit("change");
  },

  getJwt() {
    return this.jwt;
  },

  getProfile() {
    return this.profile;
  },
});
