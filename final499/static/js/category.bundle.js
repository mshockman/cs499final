(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("jQuery"));
	else if(typeof define === 'function' && define.amd)
		define(["jQuery"], factory);
	else if(typeof exports === 'object')
		exports["pendora"] = factory(require("jQuery"));
	else
		root["pendora"] = factory(root["jQuery"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE_jquery__) {
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
/******/ 		"category": 0
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
/******/ 	deferredModules.push(["./src/js/category.js","vendors"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/js/CategoryWindow.js":
/*!**********************************!*\
  !*** ./src/js/CategoryWindow.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return CategoryWindow; });
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery */ "jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _StockPickerWindow__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./StockPickerWindow */ "./src/js/StockPickerWindow.js");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



var TEMPLATE = "\n<div class=\"modal\">\n    <div class=\"modal-dialog\">\n        <div class=\"modal-content\">\n            <div class=\"modal-header\">\n                <h3 class=\"modal-title\">Add & Remove Stocks</h3>\n            </div>\n            <div class=\"modal-body\">\n                <div>\n                    <div>\n                        <div class=\"mb-2\"><button type=\"button\" class=\"js-add-stock-btn\">Add Stock</button></div>\n                        <table class=\"table js-stock-table table-bordered\">\n                            <thead>\n                                <tr>\n                                    <th>Stock</th>\n                                    <th>Action</th>\n                                </th>\n                            </thead>    \n                            <tbody></tbody>\n                        </table>\n                    </div>\n                </div>\n            </div>\n            <div class=\"modal-footer\">\n                <button type=\"button\" class=\"js-close-category-window\">Close</button>\n            </div>\n        </div>\n    </div>\n</div>\n";
/**
 * Creates a modal window dialog for managing the stock information for a category.
 */

var CategoryWindow =
/*#__PURE__*/
function () {
  function CategoryWindow(id) {
    var _this = this;

    _classCallCheck(this, CategoryWindow);

    this.$element = jquery__WEBPACK_IMPORTED_MODULE_0___default()(TEMPLATE);
    this.id = id;
    this.stockPicker = new _StockPickerWindow__WEBPACK_IMPORTED_MODULE_1__["default"]();
    this.stockPicker.appendTo(this.$element);
    this.$table = this.$element.find('.js-stock-table');
    this.$tbody = this.$table.find('tbody');
    this.$element[0].style.marginTop = '2rem';
    this.$element.find('.js-add-stock-btn').on('click', function () {
      _this.stockPicker.clear();

      _this.stockPicker.open();
    });

    this.stockPicker.onSubmit =
    /*#__PURE__*/
    function () {
      var _ref2 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(_ref) {
        var id, ticker;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                id = _ref.id, ticker = _ref.ticker;
                _context.next = 3;
                return _this.postStock(id, ticker);

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }();

    this.$element.find('.js-close-category-window').on('click', function () {
      _this.close();
    });
    this.loadCategory(id);
  }

  _createClass(CategoryWindow, [{
    key: "appendTo",
    value: function appendTo(selector) {
      return this.$element.appendTo(selector);
    }
  }, {
    key: "remove",
    value: function remove() {
      return this.$element.remove();
    }
  }, {
    key: "open",
    value: function open() {
      this.$element.modal('show');
    }
  }, {
    key: "close",
    value: function close() {
      this.$element.modal('hide');
    }
  }, {
    key: "addStock",
    value: function addStock(stock_id, ticker) {
      this.$tbody.append("<tr data-id=\"".concat(stock_id, "\"><td>").concat(ticker, "</td><td><button type=\"button\" data-action=\"remove\">Remove</button></td></tr>"));
    }
  }, {
    key: "postStock",
    value: function () {
      var _postStock = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(stock_id, ticker) {
        var response, data;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                console.log(this.id, stock_id, ticker);
                _context2.next = 3;
                return fetch('/ajax/category/add_stock', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    'category_id': this.id,
                    'stock_id': stock_id
                  })
                });

              case 3:
                response = _context2.sent;
                _context2.next = 6;
                return response.json();

              case 6:
                data = _context2.sent;
                // todo check for error
                this.addStock(stock_id, ticker);

              case 8:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function postStock(_x2, _x3) {
        return _postStock.apply(this, arguments);
      }

      return postStock;
    }()
  }, {
    key: "emptyStocks",
    value: function emptyStocks() {
      this.$tbody.empty();
    }
  }, {
    key: "loadCategory",
    value: function () {
      var _loadCategory = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3(id) {
        var response, data, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, stock;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return fetch("/ajax/category/info?id=".concat(id));

              case 2:
                response = _context3.sent;
                _context3.next = 5;
                return response.json();

              case 5:
                data = _context3.sent;
                this.emptyStocks();
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context3.prev = 10;

                for (_iterator = data.stocks[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  stock = _step.value;
                  this.addStock(stock.stock_id, stock.ticker);
                }

                _context3.next = 18;
                break;

              case 14:
                _context3.prev = 14;
                _context3.t0 = _context3["catch"](10);
                _didIteratorError = true;
                _iteratorError = _context3.t0;

              case 18:
                _context3.prev = 18;
                _context3.prev = 19;

                if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                  _iterator["return"]();
                }

              case 21:
                _context3.prev = 21;

                if (!_didIteratorError) {
                  _context3.next = 24;
                  break;
                }

                throw _iteratorError;

              case 24:
                return _context3.finish(21);

              case 25:
                return _context3.finish(18);

              case 26:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[10, 14, 18, 26], [19,, 21, 25]]);
      }));

      function loadCategory(_x4) {
        return _loadCategory.apply(this, arguments);
      }

      return loadCategory;
    }()
  }]);

  return CategoryWindow;
}();



/***/ }),

/***/ "./src/js/StockPickerWindow.js":
/*!*************************************!*\
  !*** ./src/js/StockPickerWindow.js ***!
  \*************************************/
/*! exports provided: debounce, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "debounce", function() { return debounce; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return StockPickerWindow; });
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery */ "jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }


/**
 * Throttles a function to only be executed after a given wait period.  If multiple calls to the debounced function
 * are made within that period the waiting period is set.
 * @param fn
 * @param wait
 * @returns {Function}
 */

function debounce(fn, wait) {
  var timeout;
  return function () {
    var _this = this;

    var args = arguments;

    var later = function later() {
      timeout = null;
      fn.apply(_this, args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(later, wait);
  };
}
var TEMPLATE = "\n<div class=\"modal\">\n    <div class=\"modal-dialog\">\n        <div class=\"modal-content\">\n            <div class=\"modal-header\">\n                <h3 class=\"modal-title\">Find Stock</h3>\n            </div>\n            <div class=\"modal-body\">\n                <div class=\"form-group\">\n                    <input type=\"text\" name=\"search\" class=\"form-control js-stock-search\" placeholder=\"Search\" />\n                </div>\n                <div>\n                    <ul class=\"js-stock-output stock-list\"></ul>\n                </div>\n            </div>\n            <div class=\"modal-footer\">\n                <button type=\"button\" class=\"js-stock-add-btn\">Add</button>\n                <button type=\"button\" class=\"js-close-stock-picker-window\">Close</button>\n            </div>\n        </div>\n    </div>\n</div>\n";
/**
 * Creats a modal dialog window for selecting a single stock.
 */

var StockPickerWindow =
/*#__PURE__*/
function () {
  function StockPickerWindow(category) {
    var _this2 = this;

    _classCallCheck(this, StockPickerWindow);

    this.$element = jquery__WEBPACK_IMPORTED_MODULE_0___default()(TEMPLATE);
    this.category = category;
    this.onSubmit = null;
    this.$search = this.$element.find('.js-stock-search');
    this.$search.on('keyup', debounce(
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(event) {
        var value, response, data;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                value = event.target.value;
                _context.next = 3;
                return fetch('/ajax/stock/search', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    'search': value,
                    'category': _this2.category || ''
                  })
                });

              case 3:
                response = _context.sent;
                _context.next = 6;
                return response.json();

              case 6:
                data = _context.sent;

                _this2.displayStocks(data.results);

              case 8:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }(), 500));
    this.stockOutput = this.$element.find('.js-stock-output');
    this.stockOutput.on('click', function (event) {
      var $target = jquery__WEBPACK_IMPORTED_MODULE_0___default()(event.target).closest('.stock-list-item');
      if (!$target[0]) return;

      _this2.stockOutput.find('.stock-list-item.selected').removeClass('selected');

      $target.addClass('selected');
    });
    this.$element.find('.js-stock-add-btn').on('click', function (event) {
      var selected = _this2.stockOutput.find('.stock-list-item.selected');

      var id = selected.data('id'),
          ticker = selected.text();

      if (_this2.onSubmit) {
        _this2.onSubmit({
          id: id,
          ticker: ticker
        });
      }

      _this2.close();
    });
    this.$element.find('.js-close-stock-picker-window').on('click', function () {
      _this2.close();
    });
  }

  _createClass(StockPickerWindow, [{
    key: "appendTo",
    value: function appendTo(selector) {
      return this.$element.appendTo(selector);
    }
  }, {
    key: "remove",
    value: function remove() {
      return this.$element.remove();
    }
  }, {
    key: "clear",
    value: function clear() {
      this.stockOutput.empty();
      this.$search.val('');
    }
  }, {
    key: "open",
    value: function open() {
      this.$element.modal('show');
    }
  }, {
    key: "close",
    value: function close() {
      this.$element.modal('hide');
    }
  }, {
    key: "displayStocks",
    value: function displayStocks(stocks) {
      var $output = this.$element.find('.js-stock-output');
      $output.empty();
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = stocks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var stock = _step.value;
          $output.append("<li class=\"stock-list-item\" data-id=\"".concat(stock.id, "\">").concat(stock.ticker, "</li>"));
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

      console.log(stocks);
    }
  }]);

  return StockPickerWindow;
}();



/***/ }),

/***/ "./src/js/category.js":
/*!****************************!*\
  !*** ./src/js/category.js ***!
  \****************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery */ "jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_polyfill__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/polyfill */ "./node_modules/@babel/polyfill/lib/index.js");
/* harmony import */ var _babel_polyfill__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_polyfill__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _CategoryWindow__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./CategoryWindow */ "./src/js/CategoryWindow.js");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }




/**
 * Creates a selectable nested list of items.
 */

var TreeView =
/*#__PURE__*/
function () {
  function TreeView(selector) {
    _classCallCheck(this, TreeView);

    this.element = document.querySelector(selector);
    this._onClick = this.onClick.bind(this);
    this.element.addEventListener('click', this._onClick);
  }

  _createClass(TreeView, [{
    key: "onClick",
    value: function onClick(event) {
      var item = event.target.closest('.tree-item');
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.element.querySelectorAll('.tree-item.active')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var selected = _step.value;
          if (selected !== item) selected.classList.remove('active');
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

      if (item) {
        item.classList.add('active');
      }
    }
  }, {
    key: "empty",
    value: function empty() {
      return jquery__WEBPACK_IMPORTED_MODULE_0___default()(this.element).find('.root-node .tree-menu').empty();
    }
  }, {
    key: "removeNode",
    value: function removeNode(id) {
      if (id === 'all') {
        return this.empty();
      }

      jquery__WEBPACK_IMPORTED_MODULE_0___default()(this.element).find("[data-id=\"".concat(id, "\"]")).remove();
    }
  }, {
    key: "getSelected",
    value: function getSelected() {
      var item = this.element.querySelector('.tree-item.active');

      if (item) {
        return item.closest('.tree-menuitem');
      }
    }
  }, {
    key: "addRoot",
    value: function addRoot(_ref) {
      var id = _ref.id,
          name = _ref.name;
      var node = document.createElement('div');
      node.dataset.depth = '1';
      node.dataset.id = '' + id;
      node.dataset.children = '0';
      node.classList.add('tree-menuitem');
      var item = document.createElement('div');
      item.classList.add('tree-item');
      item.appendChild(document.createTextNode(name));
      item.style.paddingLeft = '1.5rem';
      node.appendChild(item);
      this.element.appendChild(node);
      return node;
    }
  }, {
    key: "appendItem",
    value: function appendItem(parent, _ref2) {
      var id = _ref2.id,
          name = _ref2.name;

      if (!parent) {
        return this.addRoot({
          id: id,
          name: name
        });
      }

      if (parent.matches('.tree-item')) {
        parent = parent.closest('.tree-menuitem');
      } // depth, id, children, .has-children


      var menu = TreeView.getMenu(parent),
          depth = parseInt(parent.dataset.depth) || 0;

      if (!menu) {
        menu = document.createElement('div');
        menu.classList.add('tree-menu');
        parent.appendChild(menu);
      }

      var node = document.createElement('div'),
          item = document.createElement('div');
      node.classList.add('tree-menuitem');
      item.classList.add('tree-item');
      item.appendChild(document.createTextNode(name));
      node.dataset.id = "" + id;
      node.dataset.children = '0';
      node.dataset.depth = '' + (depth + 1);
      item.style.paddingLeft = (depth + 1) * 1.5 + 'rem';
      node.appendChild(item);
      menu.appendChild(node); // Update parent

      parent.classList.add('has-children');
    }
  }], [{
    key: "getMenu",
    value: function getMenu(parent) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = parent.children[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var node = _step2.value;

          if (node.classList.contains('tree-menu')) {
            return node;
          }
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
    }
  }]);

  return TreeView;
}();

jquery__WEBPACK_IMPORTED_MODULE_0___default()(function () {
  var tree = new TreeView("#category-tree");
  document.querySelector('#create-category-btn').addEventListener('click',
  /*#__PURE__*/
  function () {
    var _ref3 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(event) {
      var selected, id, name, response, data;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              selected = tree.getSelected(), id = selected ? selected.dataset.id : null;
              name = prompt("Category Name:");

              if (!(name === null)) {
                _context.next = 4;
                break;
              }

              return _context.abrupt("return");

            case 4:
              _context.next = 6;
              return fetch('/ajax/category/create', {
                'method': "POST",
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  'parent': id,
                  'name': name
                })
              });

            case 6:
              response = _context.sent;
              _context.next = 9;
              return response.json();

            case 9:
              data = _context.sent;
              console.log(data);
              console.log(response.status);
              console.log(response.statusText);

              if (response.status !== 200) {
                alert(data['error']);
              } else {
                tree.appendItem(selected, data);
              }

            case 14:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x) {
      return _ref3.apply(this, arguments);
    };
  }());
  document.querySelector('#remove-category-btn').addEventListener('click',
  /*#__PURE__*/
  function () {
    var _ref4 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2(event) {
      var selected, id, deletaAll, response, data;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              selected = tree.getSelected(), id = selected ? selected.dataset.id : null, deletaAll = false;

              if (selected) {
                _context2.next = 4;
                break;
              }

              alert("No Category Selected");
              return _context2.abrupt("return");

            case 4:
              if (id) {
                _context2.next = 10;
                break;
              }

              if (confirm("If you delete the root node all categories will be deleted.  Are you sure?")) {
                _context2.next = 7;
                break;
              }

              return _context2.abrupt("return");

            case 7:
              deletaAll = true;
              _context2.next = 12;
              break;

            case 10:
              if (confirm("Are you sure you want to delete this category?")) {
                _context2.next = 12;
                break;
              }

              return _context2.abrupt("return");

            case 12:
              _context2.next = 14;
              return fetch('/ajax/category/remove', {
                'method': "POST",
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  'id': id,
                  'deleteAll': deletaAll
                })
              });

            case 14:
              response = _context2.sent;
              _context2.next = 17;
              return response.json();

            case 17:
              data = _context2.sent;

              if (response.status !== 200) {
                alert(data['error']);
              }

              tree.removeNode(data.deleted);

            case 20:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function (_x2) {
      return _ref4.apply(this, arguments);
    };
  }());
  document.querySelector('#add-and-remove-items-btn').addEventListener('click', function (event) {
    var selected = tree.getSelected(),
        id = selected ? selected.dataset.id : null;

    if (!id) {
      alert("No Category Selected!");
      return;
    }

    var wnd = new _CategoryWindow__WEBPACK_IMPORTED_MODULE_2__["default"](id);
    wnd.appendTo(document.body);
    wnd.open();
  });
  document.querySelector('#browse-category-btn').addEventListener('click', function (event) {
    var selected = tree.getSelected(),
        id = selected ? selected.dataset.id : null;

    if (!id) {
      alert("No Category Selected!");
      return;
    }

    window.location = "/?category=".concat(id);
  });
});

/***/ }),

/***/ "jquery":
/*!*************************!*\
  !*** external "jQuery" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_jquery__;

/***/ })

/******/ });
});
//# sourceMappingURL=category.bundle.js.map