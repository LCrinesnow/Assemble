var utils = require('./utils');
var constants = require('./constants');
var Session = require('./session');

/***
 * @class
 * Store MySQL
 * 存储用户空闲时间和出发地点
 */

var setLoginUrl = function (loginUrl) {
  defaultOptions.loginUrl = loginUrl;
};

module.exports = {
  LoginError: LoginError,
  login: login,
  setLoginUrl: setLoginUrl,
};