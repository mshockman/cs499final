(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["pendora"] = factory();
	else
		root["pendora"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"testapi": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	var jsonpArray = window["webpackJsonppendora"] = window["webpackJsonppendora"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push(["./src/js/testapi.js","vendors"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/js/testapi.js":
/*!***************************!*\
  !*** ./src/js/testapi.js ***!
  \***************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_polyfill__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/polyfill */ "./node_modules/@babel/polyfill/lib/index.js");
/* harmony import */ var _babel_polyfill__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_polyfill__WEBPACK_IMPORTED_MODULE_0__);
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }


/**
 * Controls test tabs.
 */

var Tabs =
/*#__PURE__*/
function () {
  function Tabs(selector) {
    var _this = this;

    _classCallCheck(this, Tabs);

    this.bar = $(selector);
    this.tabs = this.bar.find('.tab-btn');
    this.bar.on('click', function (event) {
      var target = $(event.target).closest('.tab-btn', _this.bar),
          tab = Tabs.getTabId(target);

      if (target) {
        _this.tabs.removeClass('active');

        target.addClass('active');
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = _this.tabs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _tab = _step.value;
            var tabId = Tabs.getTabId(_tab);
            $(tabId).removeClass('open');
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
              _iterator["return"]();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        $(tab).addClass('open');
      }
    });
  }

  _createClass(Tabs, null, [{
    key: "getTabId",
    value: function getTabId(element) {
      if (element.jquery) {
        return element.data('tab');
      } else {
        return element.dataset.tab;
      }
    }
  }]);

  return Tabs;
}();

function csvToQueryString(key, csv) {
  csv = csv.split(/\s*,\s*/);
  var params = [];
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = csv[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var item = _step2.value;
      params.push("".concat(key, "=").concat(item));
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
        _iterator2["return"]();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return params.join('&');
}

function apiReadTest() {
  return _apiReadTest.apply(this, arguments);
}

function _apiReadTest() {
  _apiReadTest = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    var $context, tickerField, ticker, url, response, results;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            $context = $("#read_test"), tickerField = $context.find('[name="ticker"]'), ticker = tickerField.val();
            url = "/api/stocks/read?ticker=".concat(ticker);
            _context.next = 4;
            return fetch(url);

          case 4:
            response = _context.sent;
            _context.next = 7;
            return response.json();

          case 7:
            results = _context.sent;
            $('#output').text(JSON.stringify(results));

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _apiReadTest.apply(this, arguments);
}

function apiListTest() {
  return _apiListTest.apply(this, arguments);
}

function _apiListTest() {
  _apiListTest = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2() {
    var $context, tickers, params, url, response, results;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            $context = $("#list_test"), tickers = $context.find("[name='tickers']").val(), params = csvToQueryString('tickers', tickers);
            url = "/api/stocks/list?".concat(params);
            _context2.next = 4;
            return fetch(url);

          case 4:
            response = _context2.sent;
            _context2.next = 7;
            return response.json();

          case 7:
            results = _context2.sent;
            $('#output').text(JSON.stringify(results));

          case 9:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _apiListTest.apply(this, arguments);
}

function apiTopTest() {
  return _apiTopTest.apply(this, arguments);
}

function _apiTopTest() {
  _apiTopTest = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3() {
    var $context, industry, url, response, results;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            $context = $("#top_test"), industry = $context.find("[name='industry']").val();
            url = "/api/stocks/top?industry=".concat(industry);
            _context3.next = 4;
            return fetch(url);

          case 4:
            response = _context3.sent;
            _context3.next = 7;
            return response.json();

          case 7:
            results = _context3.sent;
            $('#output').text(JSON.stringify(results));

          case 9:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _apiTopTest.apply(this, arguments);
}

function getFormData($context) {
  var r = {};
  $context.find('form input').each(function (index, element) {
    if (element.name) {
      r[element.name] = $(element).val();
    }
  });
  return r;
}

function apiCreateTest() {
  return _apiCreateTest.apply(this, arguments);
}

function _apiCreateTest() {
  _apiCreateTest = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4() {
    var $context, data, url, response, results;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            $context = $('#create_test'), data = getFormData($context), url = "/api/stocks/create";
            _context4.next = 3;
            return fetch(url, {
              method: "POST",
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
            });

          case 3:
            response = _context4.sent;
            _context4.next = 6;
            return response.json();

          case 6:
            results = _context4.sent;
            $('#output').text(JSON.stringify(results));

          case 8:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _apiCreateTest.apply(this, arguments);
}

function apiUpdateTest() {
  return _apiUpdateTest.apply(this, arguments);
}

function _apiUpdateTest() {
  _apiUpdateTest = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5() {
    var $context, data, url, response, results;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            $context = $('#update_test'), data = getFormData($context), url = "/api/stocks/update";
            _context5.next = 3;
            return fetch(url, {
              method: "POST",
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
            });

          case 3:
            response = _context5.sent;
            _context5.next = 6;
            return response.json();

          case 6:
            results = _context5.sent;
            $('#output').text(JSON.stringify(results));

          case 8:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));
  return _apiUpdateTest.apply(this, arguments);
}

function apiDeleteTest() {
  return _apiDeleteTest.apply(this, arguments);
}

function _apiDeleteTest() {
  _apiDeleteTest = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee6() {
    var $context, tickers, params, url, response, results;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            $context = $('#delete_test'), tickers = $context.find("[name='tickers']").val(), params = csvToQueryString('tickers', tickers);
            url = "/api/stocks/delete?".concat(params);
            _context6.next = 4;
            return fetch(url);

          case 4:
            response = _context6.sent;
            _context6.next = 7;
            return response.json();

          case 7:
            results = _context6.sent;
            $('#output').text(JSON.stringify(results));

          case 9:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));
  return _apiDeleteTest.apply(this, arguments);
}

$(function () {
  new Tabs("#tabbar");
  $("#update_test .modal-title").text("Update Stock");
  $("#update_test form").prop('action', 'javascript:void(0)');
  $("#update_test form button").remove();
  $("#create_test form").prop('action', 'javascript:void(0)');
  $("#create_test form button").remove();
  $('#api-read-btn').on('click', apiReadTest);
  $('#api-list-btn').on('click', apiListTest);
  $('#api-top-btn').on('click', apiTopTest);
  $('#api-create-btn').on('click', apiCreateTest);
  $('#api-update-btn').on('click', apiUpdateTest);
  $('#api-delete-btn').on('click', apiDeleteTest);
});

/***/ })

/******/ });
});
//# sourceMappingURL=testapi.bundle.js.map