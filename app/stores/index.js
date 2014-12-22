'use strict';

var LoginStore = require('./login');
var PersonStore = require('./person');
var MatchStore = require('./match');
var SuggestionStore = require('./suggestion');

var createStores = module.exports = function createStores() {
  return {
  	LoginStore: new LoginStore(),
    PersonStore: new PersonStore(),
    MatchStore: new MatchStore(),
    SuggestionStore: new SuggestionStore(),
  };
};
