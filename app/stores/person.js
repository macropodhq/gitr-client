'use strict';

var _ = require('lodash');
var Fluxxor = require('fluxxor');

var log = require('bows')('Person Store');

var constants = require('../action-constants');
var Common = require('./common');

var PersonStore = module.exports = Fluxxor.createStore({
  initialize: function() {
    this.models = [];

    this.isLoading = false;
    this.error = null;

    this.bindActions(
      constants.PERSON_GET_PENDING, this.handleGetPending,
      constants.PERSON_GET_COMPLETE, this.handleGetComplete
    );

    log('INIT', this);
  },

  handleGetPending: Common.handleGetPending,
  handleGetComplete(payload) {
    if (payload.error) {
      return Common.handleGetComplete.call(this, payload);
    }

    return Common.handleGetComplete.call(this, {model: payload.model.person});
  },
  get: Common.get,
  getBy: Common.getBy,
  getAll: Common.getAll,
  getState: Common.getState,
});
