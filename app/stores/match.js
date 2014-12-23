'use strict';

var _ = require('lodash');
var Fluxxor = require('fluxxor');

var log = require('bows')('Match Store');

var constants = require('../action-constants');
var Common = require('./common');

var MatchStore = module.exports = Fluxxor.createStore({
  initialize: function() {
    this.models = [];

    this.isLoading = false;
    this.error = null;
    this.createCompleteWaiting = [];
    this.updateCompleteWaiting = [];
    this.deleteCompleteWaiting = [];

    this.bindActions(
      constants.MATCH_LOAD_PENDING, this.handleLoadPending,
      constants.MATCH_LOAD_COMPLETE, this.handleLoadComplete,
      constants.MATCH_GET_PENDING, this.handleGetPending,
      constants.MATCH_GET_COMPLETE, this.handleGetComplete,
      constants.MATCH_CREATE_PENDING, this.handleCreatePending,
      constants.MATCH_CREATE_COMPLETE, this.handleCreateComplete,
      constants.MATCH_CREATE_REMOTE, this.handleCreateRemote,
      constants.MATCH_UPDATE_PENDING, this.handleUpdatePending,
      constants.MATCH_UPDATE_COMPLETE, this.handleUpdateComplete,
      constants.MATCH_UPDATE_REMOTE, this.handleUpdateRemote,
      constants.MATCH_DELETE_PENDING, this.handleDeletePending,
      constants.MATCH_DELETE_COMPLETE, this.handleDeleteComplete,
      constants.MATCH_DELETE_REMOTE, this.handleDeleteRemote
    );

    log('INIT', this);
  },

  handleLoadPending: Common.handleLoadPending,
  handleLoadComplete: Common.handleLoadComplete,
  handleGetPending: Common.handleGetPending,
  handleGetComplete(payload) {
    if (payload.error) {
      return Common.handleGetComplete.call(this, payload);
    }

    return Common.handleGetComplete.call(this, {model: payload.model.person});
  },
  handleCreatePending: Common.handleCreatePending,
  handleCreateComplete: Common.handleCreateComplete,
  handleCreateRemote: Common.handleCreateRemote,
  handleUpdatePending: Common.handleUpdatePending,
  handleUpdateComplete: Common.handleUpdateComplete,
  handleUpdateRemote: Common.handleUpdateRemote,
  handleDeletePending: Common.handleDeletePending,
  handleDeleteComplete: Common.handleDeleteComplete,
  handleDeleteRemote: Common.handleDeleteRemote,
  get: Common.get,
  getBy: Common.getBy,
  getAll: Common.getAll,
  getState: Common.getState,
});
