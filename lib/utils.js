'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.asEffect = exports.createMockTask = exports.arrayOfDeffered = exports.deferred = exports.is = exports.noop = exports.TASK = undefined;

var _utils = require('./internal/utils');

var _io = require('./internal/io');

exports.TASK = _utils.TASK;
exports.noop = _utils.noop;
exports.is = _utils.is;
exports.deferred = _utils.deferred;
exports.arrayOfDeffered = _utils.arrayOfDeffered;
exports.createMockTask = _utils.createMockTask;
// IE8-compatible-fix: fix upstream Babel export-from bug(?)
// IE8-compatible-fix: fix upstream Babel export-from bug(?)

exports.asEffect = _io.asEffect;