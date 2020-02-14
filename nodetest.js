(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.iansLogger = factory());
}(this, (function () { 'use strict';

	var isMergeableObject = function isMergeableObject(value) {
		return isNonNullObject(value)
			&& !isSpecial(value)
	};

	function isNonNullObject(value) {
		return !!value && typeof value === 'object'
	}

	function isSpecial(value) {
		var stringValue = Object.prototype.toString.call(value);

		return stringValue === '[object RegExp]'
			|| stringValue === '[object Date]'
			|| isReactElement(value)
	}

	// see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/ReactElement.js#L21-L25
	var canUseSymbol = typeof Symbol === 'function' && Symbol.for;
	var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for('react.element') : 0xeac7;

	function isReactElement(value) {
		return value.$$typeof === REACT_ELEMENT_TYPE
	}

	function emptyTarget(val) {
		return Array.isArray(val) ? [] : {}
	}

	function cloneUnlessOtherwiseSpecified(value, options) {
		return (options.clone !== false && options.isMergeableObject(value))
			? deepmerge(emptyTarget(value), value, options)
			: value
	}

	function defaultArrayMerge(target, source, options) {
		return target.concat(source).map(function(element) {
			return cloneUnlessOtherwiseSpecified(element, options)
		})
	}

	function getMergeFunction(key, options) {
		if (!options.customMerge) {
			return deepmerge
		}
		var customMerge = options.customMerge(key);
		return typeof customMerge === 'function' ? customMerge : deepmerge
	}

	function getEnumerableOwnPropertySymbols(target) {
		return Object.getOwnPropertySymbols
			? Object.getOwnPropertySymbols(target).filter(function(symbol) {
				return target.propertyIsEnumerable(symbol)
			})
			: []
	}

	function getKeys(target) {
		return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target))
	}

	function propertyIsOnObject(object, property) {
		try {
			return property in object
		} catch(_) {
			return false
		}
	}

	// Protects from prototype poisoning and unexpected merging up the prototype chain.
	function propertyIsUnsafe(target, key) {
		return propertyIsOnObject(target, key) // Properties are safe to merge if they don't exist in the target yet,
			&& !(Object.hasOwnProperty.call(target, key) // unsafe if they exist up the prototype chain,
				&& Object.propertyIsEnumerable.call(target, key)) // and also unsafe if they're nonenumerable.
	}

	function mergeObject(target, source, options) {
		var destination = {};
		if (options.isMergeableObject(target)) {
			getKeys(target).forEach(function(key) {
				destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
			});
		}
		getKeys(source).forEach(function(key) {
			if (propertyIsUnsafe(target, key)) {
				return
			}

			if (propertyIsOnObject(target, key) && options.isMergeableObject(source[key])) {
				destination[key] = getMergeFunction(key, options)(target[key], source[key], options);
			} else {
				destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
			}
		});
		return destination
	}

	function deepmerge(target, source, options) {
		options = options || {};
		options.arrayMerge = options.arrayMerge || defaultArrayMerge;
		options.isMergeableObject = options.isMergeableObject || isMergeableObject;
		// cloneUnlessOtherwiseSpecified is added to `options` so that custom arrayMerge()
		// implementations can use it. The caller may not replace it.
		options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;

		var sourceIsArray = Array.isArray(source);
		var targetIsArray = Array.isArray(target);
		var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

		if (!sourceAndTargetTypesMatch) {
			return cloneUnlessOtherwiseSpecified(source, options)
		} else if (sourceIsArray) {
			return options.arrayMerge(target, source, options)
		} else {
			return mergeObject(target, source, options)
		}
	}

	deepmerge.all = function deepmergeAll(array, options) {
		if (!Array.isArray(array)) {
			throw new Error('first argument should be an array')
		}

		return array.reduce(function(prev, next) {
			return deepmerge(prev, next, options)
		}, {})
	};

	var deepmerge_1 = deepmerge;

	var cjs = deepmerge_1;

	function makeColor(opening, closing) {
	    var func = function (msg) {
	        return "\u001B[" + opening + "m" + msg + "\u001B[" + closing + "m";
	    };
	    Object.defineProperty(func, 'start', { value: opening, configurable: false, writable: false });
	    Object.defineProperty(func, 'stop', { value: closing, configurable: false, writable: false });
	    return func;
	}
	var colors = {
	    reset: makeColor(0, 0),
	    bold: makeColor(1, 22),
	    dim: makeColor(2, 22),
	    italic: makeColor(3, 23),
	    underline: makeColor(4, 24),
	    inverse: makeColor(7, 27),
	    hidden: makeColor(8, 28),
	    strikethrough: makeColor(9, 29),
	    black: makeColor(30, 39),
	    red: makeColor(31, 39),
	    green: makeColor(32, 39),
	    yellow: makeColor(33, 39),
	    blue: makeColor(34, 39),
	    magenta: makeColor(35, 39),
	    cyan: makeColor(36, 39),
	    white: makeColor(37, 39),
	    gray: makeColor(90, 39),
	    grey: makeColor(90, 39),
	    brightRed: makeColor(91, 39),
	    brightGreen: makeColor(92, 39),
	    brightYellow: makeColor(93, 39),
	    brightBlue: makeColor(94, 39),
	    brightMagenta: makeColor(95, 39),
	    brightCyan: makeColor(96, 39),
	    brightWhite: makeColor(97, 39),
	    bgBlack: makeColor(40, 49),
	    bgRed: makeColor(41, 49),
	    bgGreen: makeColor(42, 49),
	    bgYellow: makeColor(43, 49),
	    bgBlue: makeColor(44, 49),
	    bgMagenta: makeColor(45, 49),
	    bgCyan: makeColor(46, 49),
	    bgWhite: makeColor(47, 49),
	    bgGray: makeColor(100, 49),
	    bgGrey: makeColor(100, 49),
	    bgBrightRed: makeColor(101, 49),
	    bgBrightGreen: makeColor(102, 49),
	    bgBrightYellow: makeColor(103, 49),
	    bgBrightBlue: makeColor(104, 49),
	    bgBrightMagenta: makeColor(105, 49),
	    bgBrightCyan: makeColor(106, 49),
	    bgBrightWhite: makeColor(107, 49),
	    blackBG: makeColor(40, 49),
	    redBG: makeColor(41, 49),
	    greenBG: makeColor(42, 49),
	    yellowBG: makeColor(43, 49),
	    blueBG: makeColor(44, 49),
	    magentaBG: makeColor(45, 49),
	    cyanBG: makeColor(46, 49),
	    whiteBG: makeColor(47, 49)
	};
	function isNode() {
	    try {
	        return !window;
	    }
	    catch (_a) {
	        return true;
	    }
	}

	var envIsNode = isNode();
	var DefaultConfig;
	function flat(arr) {
	    var res = [];
	    for (var i = 0; i < arr.length; i++) {
	        if (arr[i].constructor === Array) {
	            res.push.apply(res, arr[i]);
	        }
	        else {
	            res.push(arr[i]);
	        }
	    }
	    return res;
	}
	var Logger = /** @class */ (function () {
	    function Logger(fullConfig) {
	        this.config = fullConfig;
	        if (envIsNode) {
	            this.colors = colors;
	        }
	    }
	    Logger.prototype.banner = function () {
	        var segments = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            segments[_i] = arguments[_i];
	        }
	        if (envIsNode) {
	            var str = '';
	            for (var _a = 0, segments_1 = segments; _a < segments_1.length; _a++) {
	                var segment = segments_1[_a];
	                var current = segment;
	                var result = current.content;
	                for (var _b = 0, _c = current.styles; _b < _c.length; _b++) {
	                    var style = _c[_b];
	                    result = style(result);
	                }
	                str += result;
	            }
	            return [str];
	        }
	        else {
	            if (segments.length === 1) {
	                var segment = segments[0];
	                return [
	                    "%c " + segment.content + " %c",
	                    "background:" + (segment.backgroundColor ||
	                        '#35495e') + "; padding: 1px; border-radius: 3px 3px 3px 3px;  color: " + (segment.color ||
	                        '#fff') + ";" + (segment.css || ''),
	                    "background:transparent"
	                ];
	            }
	            else if (segments.length === 2) {
	                var segment = segments[0];
	                var last = segments[1];
	                return [
	                    "%c " + segment.content + " %c " + last.content + " %c ",
	                    "background:" + (segment.backgroundColor ||
	                        '#35495e') + "; padding: 1px; border-radius: 3px 0px 0px 3px;  color: " + (segment.color ||
	                        '#fff') + ";" + (segment.css || ''),
	                    "background: " + (last.backgroundColor ||
	                        'gray') + "; padding: 1px; border-radius: 0 3px 3px 0;  color: " + (last.color ||
	                        '#fff') + ";" + (last.css || ''),
	                    "background:transparent"
	                ];
	            }
	            else if (segments.length > 2) {
	                var text = '%c ' +
	                    segments
	                        .map(function (segment) { return segment.content; })
	                        .join(' %c ') +
	                    ' %c';
	                var first = segments.shift();
	                var last = segments.pop();
	                var segment = [text];
	                segment.push("background:" + (first.backgroundColor ||
	                    '#35495e') + "; padding: 1px; border-radius: 3px 0px 0px 3px;  color: " + (first.color ||
	                    '#fff') + ";" + (first.css || ''));
	                for (var i = 0; i < segments.length; i++) {
	                    var current = segments[i];
	                    segment.push("background:" + (current.backgroundColor ||
	                        '#35495e') + "; padding: 1px;  color: " + (current.color || '#fff') + ";" + (current.css || ''));
	                }
	                segment.push("background:" + (last.backgroundColor ||
	                    'gray') + "; padding: 1px; border-radius: 0px 3px 3px 0px;  color: " + (last.color ||
	                    '#fff') + ";" + (last.css || ''), "background:transparent", " ");
	                return segment;
	            }
	        }
	        return [];
	    };
	    Logger.prototype.createLogger = function (config) {
	        var computedConfig = cjs(DefaultConfig, config);
	        return new Logger(computedConfig);
	    };
	    Logger.prototype.format = function (conf, args) {
	        if (envIsNode) {
	            if (typeof conf.pre === 'string') {
	                conf.pre = [conf.pre];
	            }
	            if (this.config.timeStamp) {
	                var msg = Array.from(conf.pre);
	                msg[0] = this.config.timeStamp() + ' ' + msg[0];
	                return flat([msg, args]);
	            }
	            else {
	                return flat([conf.pre, args]);
	            }
	        }
	        else {
	            if (typeof conf.pre === 'string') {
	                conf.pre = [conf.pre];
	            }
	            if (this.config.timeStamp) {
	                var msg = Array.from(conf.pre);
	                msg[0] = this.config.timeStamp() + ' ' + msg[0];
	                return flat([msg, args]);
	            }
	            else {
	                return flat([conf.pre, args]);
	            }
	        }
	    };
	    Logger.prototype.assert = function (assertion) {
	        var message = [];
	        for (var _i = 1; _i < arguments.length; _i++) {
	            message[_i - 1] = arguments[_i];
	        }
	        if (!assertion) {
	            console.log.apply(console, this.format(this.config.assert, flat(['Assertion failed:', message])));
	        }
	    };
	    Logger.prototype.count = function (label) {
	        console.count(label);
	    };
	    Logger.prototype.countReset = function (label) {
	        console.countReset(label);
	    };
	    Logger.prototype.debug = function () {
	        var message = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            message[_i] = arguments[_i];
	        }
	        console.debug.apply(console, this.format(this.config.debug, message));
	    };
	    Logger.prototype.dir = function () {
	        var message = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            message[_i] = arguments[_i];
	        }
	        console.dir.apply(console, this.format(this.config.dir, message));
	    };
	    Logger.prototype.dirxml = function (value) {
	        console.dirxml(value);
	    };
	    Logger.prototype.error = function () {
	        var message = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            message[_i] = arguments[_i];
	        }
	        console.log.apply(console, this.format(this.config.error, message));
	    };
	    Logger.prototype.group = function () {
	        var message = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            message[_i] = arguments[_i];
	        }
	        console.group.apply(console, this.format(this.config.group, message));
	    };
	    Logger.prototype.groupCollapsed = function () {
	        var message = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            message[_i] = arguments[_i];
	        }
	        console.groupCollapsed.apply(console, this.format(this.config.groupCollapsed, message));
	    };
	    Logger.prototype.info = function () {
	        var message = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            message[_i] = arguments[_i];
	        }
	        console.info.apply(console, this.format(this.config.info, message));
	    };
	    Logger.prototype.log = function () {
	        var message = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            message[_i] = arguments[_i];
	        }
	        console.log.apply(console, this.format(this.config.log, message));
	    };
	    Logger.prototype.time = function (label) {
	        console.time(label);
	    };
	    Logger.prototype.timeEnd = function (label) {
	        console.timeEnd(label);
	    };
	    Logger.prototype.timeStamp = function (label) {
	        console.timeStamp(label);
	    };
	    Logger.prototype.trace = function () {
	        var message = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            message[_i] = arguments[_i];
	        }
	        console.trace.apply(console, this.format(this.config.trace, message));
	    };
	    Logger.prototype.warn = function () {
	        var message = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            message[_i] = arguments[_i];
	        }
	        console.log.apply(console, this.format(this.config.warn, message));
	    };
	    Logger.prototype.createLoggerFromName = function (name) {
	        function genericLog(type) {
	            return {
	                pre: Logger.prototype.banner({ content: name }, { content: type, backgroundColor: 'gray' })
	            };
	        }
	        return new Logger({
	            trace: genericLog('trace'),
	            warn: {
	                pre: Logger.prototype.banner({ content: name }, { content: 'warn', backgroundColor: 'rgb(207, 162, 0)' })
	            },
	            timeStamp: undefined,
	            assert: genericLog('assert'),
	            count: genericLog('count'),
	            debug: genericLog('debug'),
	            dir: genericLog('dir'),
	            error: {
	                pre: Logger.prototype.banner({ content: name }, { content: 'error', backgroundColor: 'rgb(190, 0, 0)' })
	            },
	            group: genericLog('group'),
	            groupCollapsed: genericLog('groupCollapsed'),
	            info: genericLog('info'),
	            log: {
	                pre: Logger.prototype.banner({ content: name }, { content: 'log', backgroundColor: 'gray' })
	            }
	        });
	    };
	    return Logger;
	}());
	function genaricLog(type) {
	    if (envIsNode) {
	        return {
	            pre: Logger.prototype.banner({
	                content: 'ians-logger',
	                styles: [colors.black, colors.bgWhite]
	            }, { content: type, styles: [colors.white, colors.bgGray] }),
	            styles: new Array()
	        };
	    }
	    else {
	        return {
	            pre: Logger.prototype.banner({ content: 'ians-logger' }, { content: type, backgroundColor: 'gray' })
	        };
	    }
	}
	if (envIsNode) {
	    DefaultConfig = {
	        trace: genaricLog('trace'),
	        warn: {
	            pre: Logger.prototype.banner({
	                content: 'ians-logger',
	                styles: [colors.black, colors.bgWhite]
	            }, {
	                content: 'warn',
	                styles: [colors.white, colors.bgYellow]
	            })
	        },
	        timeStamp: undefined,
	        assert: genaricLog('assert'),
	        count: genaricLog('count'),
	        debug: genaricLog('debug'),
	        dir: genaricLog('dir'),
	        error: {
	            pre: Logger.prototype.banner({
	                content: 'ians-logger',
	                styles: [colors.black, colors.bgWhite]
	            }, { content: 'error', styles: [colors.white, colors.bgRed] })
	        },
	        group: genaricLog('group'),
	        groupCollapsed: genaricLog('groupCollapsed'),
	        info: genaricLog('info'),
	        log: {
	            pre: Logger.prototype.banner({
	                content: 'ians-logger',
	                styles: [colors.black, colors.bgWhite]
	            }, { content: 'log', styles: [colors.white, colors.bgGray] })
	        }
	    };
	}
	else {
	    DefaultConfig = {
	        trace: genaricLog('trace'),
	        warn: {
	            pre: Logger.prototype.banner({ content: 'ians-logger' }, { content: 'warn', backgroundColor: 'rgb(207, 162, 0)' })
	        },
	        timeStamp: undefined,
	        assert: genaricLog('assert'),
	        count: genaricLog('count'),
	        debug: genaricLog('debug'),
	        dir: genaricLog('dir'),
	        error: {
	            pre: Logger.prototype.banner({ content: 'ians-logger' }, { content: 'error', backgroundColor: 'rgb(190, 0, 0)' })
	        },
	        group: genaricLog('group'),
	        groupCollapsed: genaricLog('groupCollapsed'),
	        info: genaricLog('info'),
	        log: {
	            pre: Logger.prototype.banner({ content: 'ians-logger' }, { content: 'log', backgroundColor: 'gray' })
	        }
	    };
	}
	var iansLogger = new Logger(DefaultConfig);

	return iansLogger;

})));
//# sourceMappingURL=nodetest.js.map
