'use strict';

var _ = require('lodash');
var Fluxxor = require('fluxxor');

var log = require('bows')('Message Store');

var constants = require('../action-constants');
var Common = require('./common');

var MessageStore = module.exports = Fluxxor.createStore({
  initialize: function() {
    this.models = [];

    this.isLoading = false;
    this.error = null;
    this.createCompleteWaiting = [];

    this.bindActions(
      constants.MATCH_GET_PENDING, this.handleLoadPending,
      constants.MATCH_GET_COMPLETE, this.handleLoadComplete,
      constants.MESSAGE_CREATE_PENDING, this.handleCreatePending,
      constants.MESSAGE_CREATE_COMPLETE, this.handleCreateComplete,
      constants.MESSAGE_CREATE_REMOTE, this.handleCreateRemote
    );

    log('INIT', this);
  },

  handleLoadPending: Common.handleLoadPending,
  handleLoadComplete(payload) {
    if (payload.error) {
      return Common.handleLoadComplete.call(this, payload);
    }

    return Common.handleLoadComplete.call(this, {
      models: payload.model.messages.map(function(message) {
        return _.extend({}, message, {matchId: payload.model.person.id});
      }),
    });
  },
  handleCreatePending: Common.handleCreatePending,
  handleCreateComplete: Common.handleCreateComplete,
  handleCreateRemote: Common.handleCreateRemote,
  get: Common.get,
  getBy: Common.getBy,
  getAll: Common.getAll,
  getState: Common.getState,
  getByMatchId: Common.makeGetBy("matchId"),
});
