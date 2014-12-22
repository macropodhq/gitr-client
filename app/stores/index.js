'use strict';

var LoginStore = require('./login');
var PersonStore = require('./person');
var MatchStore = require('./match');

var createStores = module.exports = function createStores() {
  return {
  	LoginStore: new LoginStore(),
    PersonStore: new PersonStore(),
    MatchStore: new MatchStore(),
  };
};
