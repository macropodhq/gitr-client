'use strict';

var _ = require('lodash');
var Fluxxor = require('fluxxor');

var log = require('bows')('Suggestion Store');

var constants = require('../action-constants');
var Common = require('./common');

var SuggestionStore = module.exports = Fluxxor.createStore({
  initialize: function() {
    this.models = [];

    this.isLoading = false;
    this.error = null;

    this.bindActions(
      constants.PERSON_LOAD_PENDING, this.handleLoadPending,
      constants.PERSON_LOAD_COMPLETE, this.handleLoadComplete
    );

    log('INIT', this);
  },

  handleLoadPending: Common.handleLoadPending,
  handleLoadComplete: Common.handleLoadComplete,
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
