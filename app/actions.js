'use strict';

var _ = require('lodash');
var agent = require('superagent');
var defaults = require('superagent-defaults');
var uuid = require('uuid');
var Houkou = require('houkou');

var log = require('bows')('Actions');

var constants = require('./action-constants');

var makeFetchMultiple = function(ctx, pendingEvent, completeEvent, key, urlTemplate) {
  log('Generating fetchMultiple function', pendingEvent, completeEvent);

  return function() {
    var operationId = uuid.v1();

    this.dispatch(pendingEvent, {
      operationId: operationId,
    });

    var self = this;
    ctx.agent.get(urlTemplate.build({})).end(function(res) {
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

var makeFetchOne = function(ctx, pendingEvent, completeEvent, urlTemplate) {
  log('Generating fetchOneOf function', pendingEvent, completeEvent);

  return function(id) {
    var operationId = uuid.v1();

    this.dispatch(pendingEvent, {
      operationId: operationId,
      id: id,
    });

    var self = this;
    ctx.agent.get(urlTemplate.build({id: id})).end(function(res) {
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

var makeCreate = function(ctx, pendingEvent, completeEvent, urlTemplate, attributeValidation) {
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
    ctx.agent.post(urlTemplate.build({})).send(attributes).end(function(res) {
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

var makeUpdate = function(ctx, pendingEvent, completeEvent, urlTemplate, attributeValidation) {
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
    ctx.agent.put(urlTemplate.build({id: id})).send(attributes).end(function(res) {
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

var makeDelete = function(ctx, pendingEvent, completeEvent, urlTemplate) {
  log('Generating delete function', pendingEvent, completeEvent);

  return function(id) {
    var operationId = uuid.v1();

    this.dispatch(pendingEvent, {
      operationId: operationId,
      id: id,
    });

    var self = this;
    ctx.agent.del(urlTemplate.build({id: id})).end(function(res) {
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

module.exports = function createActions(baseUrl) {
  var ctx = {
    agent: agent,
    jwt: null,

    setJwt(jwt) {
      if (!this.jwt) {
        this.jwt = jwt;
        this.agent = defaults().set('authorization', 'Bearer ' + jwt);
      }
    },
  };

  return {
    peopleFetch: makeFetchMultiple(ctx, constants.PERSON_LOAD_PENDING, constants.PERSON_LOAD_COMPLETE, 'people', new Houkou(baseUrl + '/people.json')),
    personFetch: makeFetchOne(ctx, constants.PERSON_GET_PENDING, constants.PERSON_GET_COMPLETE, new Houkou(baseUrl + '/people/:id.json')),
    matchesFetch: makeFetchMultiple(ctx, constants.MATCH_LOAD_PENDING, constants.MATCH_LOAD_COMPLETE, 'matches', new Houkou(baseUrl + '/matches.json')),
    matchFetch: makeFetchOne(ctx, constants.MATCH_GET_PENDING, constants.MATCH_GET_COMPLETE, new Houkou(baseUrl + '/matches/:id.json')),
    matchCreate: makeCreate(ctx, constants.MATCH_CREATE_PENDING, constants.MATCH_CREATE_COMPLETE, new Houkou(baseUrl + '/matches.json')),
    matchUpdate: makeUpdate(ctx, constants.MATCH_UPDATE_PENDING, constants.MATCH_UPDATE_COMPLETE, new Houkou(baseUrl + '/matches/:id.json')),
    matchDelete: makeDelete(ctx, constants.MATCH_DELETE_PENDING, constants.MATCH_DELETE_COMPLETE, new Houkou(baseUrl + '/matches/:id.json')),

    setJwt(jwt) {
      ctx.setJwt(jwt);
    },

    login: function(githubClientToken) {
      var operationId = uuid.v1();

      this.dispatch(constants.LOGIN_PENDING, {
        operationId: operationId,
      });

      var self = this;

      var onMessage = function onMessage(ev) {
        if (ev.origin !== window.location.origin) {
          return;
        }

        if (typeof ev.data !== "object" || ev.data === null || typeof ev.data.code !== "string") {
          return;
        }

        window.removeEventListener('message', onMessage);

        ctx.agent.post(baseUrl + '/authorize.json').send({code: ev.data.code}).end(function(res) {
          if (!res.ok) {
            return self.dispatch(constants.LOGIN_COMPLETE, {
              operationId: operationId,
              error: res.text,
            });
          }

          ctx.setJwt(res.body.token);

          return self.dispatch(constants.LOGIN_COMPLETE, {
            operationId: operationId,
            profile: _.omit(res.body, 'token'),
            jwt: res.body.token,
          });
        });
      };
      window.addEventListener('message', onMessage);

      window.open('https://github.com/login/oauth/authorize?client_id=' + githubClientToken);
    },
  };
};
