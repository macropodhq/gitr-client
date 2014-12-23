'use strict';

var LoginStore = require('./login');
var PersonStore = require('./person');
var MatchStore = require('./match');
var MessageStore = require('./message');
var SuggestionStore = require('./suggestion');

var createStores = module.exports = function createStores() {
  return {
  	LoginStore: new LoginStore(),
    PersonStore: new PersonStore(),
    MatchStore: new MatchStore(),
    MessageStore: new MessageStore(),
    SuggestionStore: new SuggestionStore(),
  };
};
