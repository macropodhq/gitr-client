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
    this.hasUnseen = false;
    this.error = null;
    this.createCompleteWaiting = [];
    this.deleteCompleteWaiting = [];

    this.bindActions(
      constants.MATCH_LOAD_PENDING, this.handleLoadPending,
      constants.MATCH_LOAD_COMPLETE, this.handleLoadComplete,
      constants.MATCH_GET_PENDING, this.handleGetPending,
      constants.MATCH_GET_COMPLETE, this.handleGetComplete,
      constants.MATCH_CREATE_PENDING, this.handleCreatePending,
      constants.MATCH_CREATE_COMPLETE, this.handleCreateComplete,
      constants.MATCH_CREATE_REMOTE, this.handleCreateRemote,
      constants.MATCH_UPDATE_REMOTE, this.handleUpdateRemote,
      constants.MATCH_DELETE_PENDING, this.handleDeletePending,
      constants.MATCH_DELETE_COMPLETE, this.handleDeleteComplete,
      constants.MATCH_DELETE_REMOTE, this.handleDeleteRemote,
      constants.MESSAGE_CREATE_REMOTE, this.handleMessageCreateRemote
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
  handleUpdateRemote: Common.handleUpdateRemote,
  handleDeletePending: Common.handleDeletePending,
  handleDeleteComplete: Common.handleDeleteComplete,
  handleDeleteRemote: Common.handleDeleteRemote,
  get: Common.get,
  getBy: Common.getBy,
  getAll: Common.getAll,
  getState: Common.getState,

  handleCreatePending(payload) {
    var model = _.extend({}, payload.attributes.person);

    this.createCompleteWaiting.push({
      operationId: payload.operationId,
      model: model,
    });
  },

  handleCreateComplete(payload) {
    var waiting = _.findWhere(this.createCompleteWaiting, {
      operationId: payload.operationId,
    });

    if (!waiting) {
      return;
    }

    this.createCompleteWaiting.splice(this.createCompleteWaiting.indexOf(waiting), 1);

    if (payload.model && payload.model.status === "Matched with other user") {
      alert('You and ' + waiting.model.login + ' are a match!');

      this.hasUnseen = true;
      waiting.model.isUnseen = true;

      this.models.push(waiting.model);

      this.emit('change');
    }
  },

  handleCreateRemote(payload) {
    var model = _.findWhere(this.models, {id: payload.model.id});

    if (!model) {
      this.models.push(model = {});

      this.hasUnseen = true;
      model.isUnseen = true;
    }

    _.extend(model, payload.model);

    this.emit('change');
  },

  handleMessageCreateRemote(payload) {
    console.log(payload);

    var model = _.findWhere(this.models, {id: payload.model.otherUserId});

    console.log(model);

    if (!model) {
      return;
    }

    model.isUnseen = true;

    this.calculateUnseen();
  },

  markSeen(id) {
    var model = this.get(id);

    if (!model) {
      return;
    }

    delete model.isUnseen;

    this.calculateUnseen();
  },

  calculateUnseen() {
    var hasUnseen = false;
    this.models.forEach(function(model) {
      hasUnseen = hasUnseen || model.isUnseen;
    });

    console.log("unseen", this.hasUnseen, "->", hasUnseen);

    if (this.hasUnseen !== hasUnseen) {
      this.hasUnseen = hasUnseen;
      this.emit('change');
    }
  },
});
