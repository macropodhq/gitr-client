'use strict';

var _ = require('lodash');

var Common = {
  handleLoadPending: function(payload) {
    this.isLoading = true;

    this.emit('change');
  },

  handleLoadComplete: function(payload) {
    this.isLoading = false;

    if (payload.error) {
      this.error = payload.error;

      this.emit('change');

      return;
    }

    _.each(payload.models, function(newModel) {
      var model = _.findWhere(this.models, {id: newModel.id});

      if (!model) {
        this.models.push(model = {});
      }

      _.extend(model, newModel);
    }, this);

    this.emit('change');
  },

  handleGetPending: function() {
    var model = _.findWhere(this.models, {id: payload.model.id});

    if (!model) {
      return;
    }

    _.extend(model, {
      isLoading: true,
    });

    this.emit('change');
  },

  handleGetComplete: function(payload) {
    var model = _.findWhere(this.models, {id: payload.model.id});

    if (!model) {
      this.models.push(model = {});
    }

    _.extend(model, payload.model, {
      isLoading: false,
    });

    this.emit('change');
  },

  handleCreatePending: function(payload) {
    var model = _.extend({}, payload.attributes, {
      isNew: true,
    });

    this.createCompleteWaiting.push({
      operationId: payload.operationId,
      model: model,
    });

    this.models.push(model);

    this.emit('change');
  },

  handleCreateComplete: function(payload) {
    var waiting = _.findWhere(this.createCompleteWaiting, {
      operationId: payload.operationId,
    });

    if (!waiting) {
      // TODO: error handling
      return;
    }

    this.createCompleteWaiting.splice(this.createCompleteWaiting.indexOf(waiting), 1);

    _.extend(waiting.model, payload.model, {
      isNew: false,
    });

    this.emit('change');
  },

  handleCreateRemote: function(payload) {
    var model = _.findWhere(this.models, {id: payload.model.id});

    if (!model) {
      this.models.push(model = {});
    }

    _.extend(model, payload.model);

    this.emit('change');
  },

  handleUpdatePending: function(payload) {
    var model = _.findWhere(this.models, {id: payload.id});

    if (!model) {
      return;
    }

    var backup = _.extend({}, _.pick(model, _.keys(payload.attributes)));

    _.extend(model, payload.attributes, {
      isUpdating: true,
    });

    this.updateCompleteWaiting.push({
      operationId: payload.operationId,
      model: model,
      backup: backup,
    });

    this.emit('change');
  },

  handleUpdateComplete: function(payload) {
    var waiting = _.findWhere(this.updateCompleteWaiting, {
      operationId: payload.operationId,
    });

    if (!waiting) {
      // TODO: error handling
      return;
    }

    this.updateCompleteWaiting.splice(this.updateCompleteWaiting.indexOf(waiting), 1);

    _.extend(waiting.model, payload.error ? waiting.backup : payload.model, {
      isUpdating: false,
    });

    this.emit('change');
  },

  handleUpdateRemote: function(payload) {
    var model = _.findWhere(this.models, {id: payload.model.id});

    if (!model) {
      return;
    }

    _.extend(model, payload.model);

    this.emit('change');
  },

  handleDeletePending: function(payload) {
    var model = _.findWhere(this.models, {id: payload.id});

    if (!model) {
      return;
    }

    this.deleteCompleteWaiting.push({
      operationId: payload.operationId,
      model: model,
    });

    _.extend(model, payload.attributes, {
      isDeleting: true,
    });

    this.emit('change');
  },

  handleDeleteComplete: function(payload) {
    var waiting = _.findWhere(this.deleteCompleteWaiting, {
      operationId: payload.operationId,
    });

    if (!waiting) {
      return;
    }

    var index = this.models.indexOf(waiting.model);
    if (index !== -1) {
      this.models.splice(index, 1);
    }

    _.extend(waiting.model, {
      isDeleting: false,
    });

    this.emit('change');
  },

  handleDeleteRemote: function(payload) {
    var model = _.findWhere(this.models, {id: payload.id});

    if (!model) {
      return;
    }

    this.models.splice(this.models.indexOf(model), 1);

    this.emit('change');
  },

  get: function(id) {
    return _.findWhere(this.models, {id: id});
  },

  getBy: function(filter) {
    return _.where(this.models, filter);
  },

  getAll: function() {
    return this.models.slice();
  },

  getState: function() {
    return {
      error: this.error,
      models: this.getAll(),
    };
  },

  makeGetBy: function(key) {
    return function(value) {
      return this.getBy(_.object([[key, value]]));
    };
  },
};

module.exports = Common;
