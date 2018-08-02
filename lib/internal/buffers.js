'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buffers = exports.BUFFER_OVERFLOW = undefined;

var _utils = require('./utils');

var BUFFER_OVERFLOW = exports.BUFFER_OVERFLOW = 'Channel\'s Buffer overflow!';

var ON_OVERFLOW_THROW = 1;
var ON_OVERFLOW_DROP = 2;
var ON_OVERFLOW_SLIDE = 3;

var zeroBuffer = { isEmpty: _utils.kTrue, put: _utils.noop, take: _utils.noop };

/**
  TODO: Need to make a more optimized implementation: e.g. Ring buffers, linked lists with Node Object pooling...
**/
function arrBuffer() {
  var limit = arguments.length <= 0 || arguments[0] === undefined ? Infinity : arguments[0];
  var overflowAction = arguments[1];

  var arr = [];
  return {
    isEmpty: function isEmpty() {
      return !arr.length;
    },
    put: function put(it) {
      if (arr.length < limit) {
        arr.push(it);
      } else {
        switch (overflowAction) {
          case ON_OVERFLOW_THROW:
            throw new Error(BUFFER_OVERFLOW);
          case ON_OVERFLOW_SLIDE:
            arr.shift();
            arr.push(it);
            break;
          default:
          // DROP
        }
      }
    },
    take: function take() {
      return arr.shift();
    }
  };
}

var buffers = exports.buffers = {
  none: function none() {
    return zeroBuffer;
  },
  fixed: function fixed(limit) {
    return arrBuffer(limit, ON_OVERFLOW_THROW);
  },
  dropping: function dropping(limit) {
    return arrBuffer(limit, ON_OVERFLOW_DROP);
  },
  sliding: function sliding(limit) {
    return arrBuffer(limit, ON_OVERFLOW_SLIDE);
  }
};