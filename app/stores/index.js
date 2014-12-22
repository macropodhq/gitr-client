'use strict';

var PersonStore = require('./person');
var MatchStore = require('./match');

var createStores = module.exports = function createStores() {
  return {
    PersonStore: new PersonStore(),
    MatchStore: new MatchStore(),
  };
};
