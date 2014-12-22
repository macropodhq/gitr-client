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
    this.updateCompleteWaiting = [];
    this.deleteCompleteWaiting = [];

    this.bindActions(
      constants.PERSON_GET_PENDING, this.handleGetPending,
      constants.PERSON_GET_COMPLETE, this.handleGetComplete,
      constants.PERSON_UPDATE_REMOTE, this.handleUpdateRemote,
      constants.PERSON_DELETE_REMOTE, this.handleDeleteRemote
    );

    log('INIT', this);
  },

  handleGetPending: Common.handleGetPending,
  handleGetComplete: Common.handleGetComplete,
  handleUpdateRemote: Common.handleUpdateRemote,
  handleDeleteRemote: Common.handleDeleteRemote,
  get: Common.get,
  getBy: Common.getBy,
  getAll: Common.getAll,
  getState: Common.getState,
});
