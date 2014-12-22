'use strict';

var _ = require('lodash');
var defaultAgent = require('superagent');
var uuid = require('uuid');
var Houkou = require('houkou');

var log = require('bows')('Actions');

var constants = require('./action-constants');

var makeFetchMultiple = function(authorisedAgent, pendingEvent, completeEvent, key, urlTemplate) {
  log('Generating fetchMultiple function', pendingEvent, completeEvent);

  return function() {
    var operationId = uuid.v1();

    this.dispatch(pendingEvent, {
      operationId: operationId,
    });

    var self = this;
    authorisedAgent.get(urlTemplate.build({})).end(function(res) {
      if (!res.ok) {
        return self.dispatch(completeEvent, {
          operationId: operationId,
          error: res.text,
        });
      }

      return self.dispatch(completeEvent, {
        operationId: operationId,
        models: res.body[key],
      });
    });
  };
};

var makeFetchOne = function(authorisedAgent, pendingEvent, completeEvent, urlTemplate) {
  log('Generating fetchOneOf function', pendingEvent, completeEvent);

  return function(id) {
    var operationId = uuid.v1();

    this.dispatch(pendingEvent, {
      operationId: operationId,
      id: id,
    });

    var self = this;
    authorisedAgent.get(urlTemplate.build({id: id})).end(function(res) {
      if (!res.ok) {
        return self.dispatch(completeEvent, {
          operationId: operationId,
          error: res.text,
        });
      }

      return self.dispatch(completeEvent, {
        operationId: operationId,
        model: res.body,
      });
    });
  };
};

var makeCreate = function(authorisedAgent, pendingEvent, completeEvent, urlTemplate, attributeValidation) {
  log('Generating create function', pendingEvent, completeEvent);

  return function(attributes) {
    var operationId = uuid.v1();
    var id = attributes.id || uuid.v4();

    attributes = _.extend({}, attributes, {id: id});

    this.dispatch(pendingEvent, {
      operationId: operationId,
      attributes: attributes,
    });

    var self = this;
    authorisedAgent.post(urlTemplate.build({})).send(attributes).end(function(res) {
      if (!res.ok) {
        return self.dispatch(completeEvent, {
          operationId: operationId,
          error: res.text,
        });
      }

      return self.dispatch(completeEvent, {
        operationId: operationId,
        model: res.body,
      });
    });
  };
};

var makeUpdate = function(authorisedAgent, pendingEvent, completeEvent, urlTemplate, attributeValidation) {
  log('Generating update function', pendingEvent, completeEvent);

  return function(attributes) {
    var operationId = uuid.v1();
    var id = attributes.id;

    attributes = _.extend({}, attributes);

    this.dispatch(pendingEvent, {
      operationId: operationId,
      id: id,
      attributes: attributes,
    });

    var self = this;
    authorisedAgent.put(urlTemplate.build({id: id})).send(attributes).end(function(res) {
      if (!res.ok) {
        return self.dispatch(completeEvent, {
          operationId: operationId,
          error: res.text,
        });
      }

      return self.dispatch(completeEvent, {
        operationId: operationId,
        model: res.body,
      });
    });
  };
};

var makeDelete = function(authorisedAgent, pendingEvent, completeEvent, urlTemplate) {
  log('Generating delete function', pendingEvent, completeEvent);

  return function(id) {
    var operationId = uuid.v1();

    this.dispatch(pendingEvent, {
      operationId: operationId,
      id: id,
    });

    var self = this;
    authorisedAgent.del(urlTemplate.build({id: id})).end(function(res) {
      if (!res.ok) {
        return self.dispatch(completeEvent, {
          operationId: operationId,
          error: res.text,
        });
      }

      return self.dispatch(completeEvent, {
        operationId: operationId,
      });
    });
  };
};

module.exports = function createActions(authorisedAgent, baseUrl) {
  return {
    peopleFetch: makeFetchMultiple(authorisedAgent, constants.PERSON_LOAD_PENDING, constants.PERSON_LOAD_COMPLETE, 'people', new Houkou(baseUrl + '/people.json')),
    personFetch: makeFetchOne(authorisedAgent, constants.PERSON_GET_PENDING, constants.PERSON_GET_COMPLETE, new Houkou(baseUrl + '/people/:id.json')),
    matchesFetch: makeFetchMultiple(authorisedAgent, constants.MATCH_LOAD_PENDING, constants.MATCH_LOAD_COMPLETE, 'matches', new Houkou(baseUrl + '/matches.json')),
    matchFetch: makeFetchOne(authorisedAgent, constants.MATCH_GET_PENDING, constants.MATCH_GET_COMPLETE, new Houkou(baseUrl + '/matches/:id.json')),
    matchCreate: makeCreate(authorisedAgent, constants.MATCH_CREATE_PENDING, constants.MATCH_CREATE_COMPLETE, new Houkou(baseUrl + '/matches.json')),
    matchUpdate: makeUpdate(authorisedAgent, constants.MATCH_UPDATE_PENDING, constants.MATCH_UPDATE_COMPLETE, new Houkou(baseUrl + '/matches/:id.json')),
    matchDelete: makeDelete(authorisedAgent, constants.MATCH_DELETE_PENDING, constants.MATCH_DELETE_COMPLETE, new Houkou(baseUrl + '/matches/:id.json')),
  };
};
