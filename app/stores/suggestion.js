'use strict';

var _ = require('lodash');
var Fluxxor = require('fluxxor');

var log = require('bows')('Suggestion Store');

var constants = require('../action-constants');
var Common = require('./common');

var SuggestionStore = module.exports = Fluxxor.createStore({
  initialize: function() {
    this.models = [];

    this.timer = null;
    this.timeout = 1;

    this.isLoading = false;
    this.error = null;

    this.bindActions(
      constants.PERSON_LOAD_PENDING, this.handleLoadPending,
      constants.PERSON_LOAD_COMPLETE, this.handleLoadComplete,
      constants.PERSON_GET_PENDING, this.handleGetPending,
      constants.PERSON_GET_COMPLETE, this.handleGetComplete
    );

    log('INIT', this);
  },

  handleLoadPending: Common.handleLoadPending,
  handleLoadComplete(payload) {
    if (Array.isArray(payload.models) && payload.models.length === 0) {
      this.timeout = Math.min(this.timeout * 2 + 1000, 1000 * 60);
    } else {
      this.timeout = 1;
    }

    return Common.handleLoadComplete.call(this, payload);
  },
  handleGetPending: Common.handleGetPending,
  handleGetComplete(payload) {
    if (payload.error) {
      return Common.handleGetComplete.call(this, payload);
    }

    return Common.handleGetComplete.call(this, {model: payload.model.person});
  },
  get: Common.get,
  getAll: Common.getAll,
  getState: Common.getState,

  length() {
    return this.models.length;
  },

  peek(n) {
    return this.models.slice(0, n);
  },

  shift() {
    this.models.shift();

    this.emit('change');
  },
});
