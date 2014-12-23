'use strict';

var _ = require('lodash');
var agent = require('superagent');
var defaults = require('superagent-defaults');
var uuid = require('uuid');
var Houkou = require('houkou');
var DecodeJWT = require('jwt-decode');

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

var makeCreate = function(ctx, pendingEvent, completeEvent, urlTemplate) {
  log('Generating create function', pendingEvent, completeEvent);

  return function(parameters, attributes) {
    var operationId = uuid.v1();

    attributes = _.extend({}, attributes);
    parameters = _.extend({}, parameters);

    this.dispatch(pendingEvent, {
      operationId: operationId,
      attributes: attributes,
    });

    var self = this;
    ctx.agent.post(urlTemplate.build(parameters)).send(attributes).end(function(res) {
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

var makeUpdate = function(ctx, pendingEvent, completeEvent, urlTemplate) {
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

module.exports = function createActions(baseUrl, pubnubKey) {
  var ctx = {
    agent: agent,
    jwt: null,
    pubnub: null,

    setJwt(jwt) {
      if (!this.jwt) {
        this.jwt = jwt;
        this.agent = defaults().set('authorization', 'Bearer ' + jwt);
      }
    },

    connectPubnub(channel, actions) {
      if (!this.pubnub) {
        this.pubnub = PUBNUB.init({
          subscribe_key: pubnubKey,
        });

        var self = this;

        this.pubnub.subscribe({
          channel: channel,
          message(incoming, env, channel) {
            if (incoming.type === "message") {
              actions.dispatch(constants.MESSAGE_CREATE_REMOTE, {
                model: {
                  id: incoming.id,
                  created_at: incoming.created_at,
                  from: incoming.from,
                  text: incoming.text,
                },
              });
            }

            if (incoming.type === "match") {
              self.agent.get(baseUrl + '/v1/matches/' + incoming.other_user_id + '.json').end(function(res) {
                if (!res.ok || !res.body || !res.body.person) {
                  return;
                }

                return actions.dispatch(constants.MATCH_CREATE_REMOTE, {
                  model: res.body.person,
                });
              });
            }
          },
        });
      }
    },
  };

  return {
    peopleFetch: makeFetchMultiple(ctx, constants.PERSON_LOAD_PENDING, constants.PERSON_LOAD_COMPLETE, 'people', new Houkou(baseUrl + '/v1/people.json')),
    personFetch: makeFetchOne(ctx, constants.PERSON_GET_PENDING, constants.PERSON_GET_COMPLETE, new Houkou(baseUrl + '/v1/people/:id.json')),
    matchesFetch: makeFetchMultiple(ctx, constants.MATCH_LOAD_PENDING, constants.MATCH_LOAD_COMPLETE, 'matches', new Houkou(baseUrl + '/v1/matches.json')),
    matchFetch: makeFetchOne(ctx, constants.MATCH_GET_PENDING, constants.MATCH_GET_COMPLETE, new Houkou(baseUrl + '/v1/matches/:id.json')),
    matchCreate: makeCreate(ctx, constants.MATCH_CREATE_PENDING, constants.MATCH_CREATE_COMPLETE, new Houkou(baseUrl + '/v1/matches.json')),
    matchDelete: makeDelete(ctx, constants.MATCH_DELETE_PENDING, constants.MATCH_DELETE_COMPLETE, new Houkou(baseUrl + '/v1/matches/:id.json')),
    messageCreate: makeCreate(ctx, constants.MESSAGE_CREATE_PENDING, constants.MESSAGE_CREATE_COMPLETE, new Houkou(baseUrl + '/v1/matches/:id/messages.json')),

    init() {
      try {
        var jwt = window.localStorage.getItem("jwt");
        var profile = JSON.parse(window.localStorage.getItem("profile"));

        var decoded = DecodeJWT(jwt);
      } catch (e) { return; }

      if (decoded.exp*1000 <= Date.now()) {
        return;
      }

      ctx.setJwt(jwt);
      ctx.connectPubnub(profile.channel, this);

      this.dispatch(constants.LOGIN_COMPLETE, {
        jwt: jwt,
        profile: profile,
      });
    },

    login() {
      var operationId = uuid.v1();

      this.dispatch(constants.LOGIN_PENDING, {
        operationId: operationId,
      });

      var self = this;

      var onMessage = function onMessage(ev) {
        if (ev.origin !== window.location.origin) {
          return;
        }

        if (typeof ev.data !== "object" || ev.data === null || typeof ev.data.token !== "string") {
          return;
        }

        window.removeEventListener('message', onMessage);

        var token = ev.data.token;

        ctx.setJwt(token);

        ctx.agent.get(baseUrl + '/v1/profile.json').end(function(res) {
          if (!res.ok) {
            return self.dispatch(constants.LOGIN_COMPLETE, {
              operationId: operationId,
              error: res.text,
            });
          }

          var profile = res.body.person;

          ctx.connectPubnub(profile.channel, self);

          return self.dispatch(constants.LOGIN_COMPLETE, {
            operationId: operationId,
            jwt: token,
            profile: profile,
          });
        });
      };
      window.addEventListener('message', onMessage);

      window.open(baseUrl + '/auth?redirect_uri=' + escape(window.location.origin + '/login-callback.html'));
    },
  };
};
