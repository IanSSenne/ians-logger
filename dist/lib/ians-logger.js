"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var deepmerge_1 = require("deepmerge");
var node_1 = require("./node");
var envIsNode = node_1.isNode();
var DefaultConfig;
/**
 * @ignore
 */
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
        this.enabled = true;
        this.config = fullConfig;
        if (envIsNode) {
            this.colors = node_1.colors;
        }
    }
    Logger.prototype.enable = function () {
        this.enabled = true;
    };
    Logger.prototype.disable = function () {
        this.enabled = false;
    };
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
        var computedConfig = deepmerge_1.default(DefaultConfig, config);
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
        if (!this.enabled)
            return; //logger is disabled. exit early.
        if (!assertion) {
            console.log.apply(console, this.format(this.config.assert, flat(['Assertion failed:', message])));
        }
    };
    Logger.prototype.count = function (label) {
        if (!this.enabled)
            return; //logger is disabled. exit early.
        console.count(label);
    };
    Logger.prototype.countReset = function (label) {
        if (!this.enabled)
            return; //logger is disabled. exit early.
        console.countReset(label);
    };
    Logger.prototype.debug = function () {
        var message = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            message[_i] = arguments[_i];
        }
        if (!this.enabled)
            return; //logger is disabled. exit early.
        console.debug.apply(//logger is disabled. exit early.
        console, this.format(this.config.debug, message));
    };
    Logger.prototype.dir = function () {
        var message = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            message[_i] = arguments[_i];
        }
        if (!this.enabled)
            return; //logger is disabled. exit early.
        console.dir.apply(//logger is disabled. exit early.
        console, this.format(this.config.dir, message));
    };
    Logger.prototype.dirxml = function (value) {
        if (!this.enabled)
            return; //logger is disabled. exit early.
        console.dirxml(value);
    };
    Logger.prototype.error = function () {
        var message = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            message[_i] = arguments[_i];
        }
        if (!this.enabled)
            return; //logger is disabled. exit early.
        console.log.apply(//logger is disabled. exit early.
        console, this.format(this.config.error, message));
    };
    Logger.prototype.group = function () {
        var message = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            message[_i] = arguments[_i];
        }
        if (!this.enabled)
            return; //logger is disabled. exit early.
        console.group.apply(//logger is disabled. exit early.
        console, this.format(this.config.group, message));
    };
    Logger.prototype.groupCollapsed = function () {
        var message = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            message[_i] = arguments[_i];
        }
        if (!this.enabled)
            return; //logger is disabled. exit early.
        console.groupCollapsed.apply(//logger is disabled. exit early.
        console, this.format(this.config.groupCollapsed, message));
    };
    Logger.prototype.info = function () {
        var message = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            message[_i] = arguments[_i];
        }
        if (!this.enabled)
            return; //logger is disabled. exit early.
        console.info.apply(//logger is disabled. exit early.
        console, this.format(this.config.info, message));
    };
    Logger.prototype.log = function () {
        var message = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            message[_i] = arguments[_i];
        }
        if (!this.enabled)
            return; //logger is disabled. exit early.
        console.log.apply(//logger is disabled. exit early.
        console, this.format(this.config.log, message));
    };
    Logger.prototype.time = function (label) {
        if (!this.enabled)
            return; //logger is disabled. exit early.
        console.time(label);
    };
    Logger.prototype.timeEnd = function (label) {
        if (!this.enabled)
            return; //logger is disabled. exit early.
        console.timeEnd(label);
    };
    Logger.prototype.timeStamp = function (label) {
        if (!this.enabled)
            return; //logger is disabled. exit early.
        console.timeStamp(label);
    };
    Logger.prototype.trace = function () {
        var message = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            message[_i] = arguments[_i];
        }
        if (!this.enabled)
            return; //logger is disabled. exit early.
        console.trace.apply(//logger is disabled. exit early.
        console, this.format(this.config.trace, message));
    };
    Logger.prototype.warn = function () {
        var message = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            message[_i] = arguments[_i];
        }
        if (!this.enabled)
            return; //logger is disabled. exit early.
        console.log.apply(//logger is disabled. exit early.
        console, this.format(this.config.warn, message));
    };
    Logger.prototype.createLoggerFromName = function (name) {
        function genaricLog(type) {
            if (envIsNode) {
                return {
                    pre: Logger.prototype.banner({
                        content: name,
                        styles: [node_1.colors.black, node_1.colors.bgWhite]
                    }, {
                        content: type,
                        styles: [node_1.colors.white, node_1.colors.bgGray]
                    }),
                    styles: new Array()
                };
            }
            else {
                return {
                    pre: Logger.prototype.banner({ content: name }, { content: type, backgroundColor: 'gray' })
                };
            }
        }
        var UsedConfig = {};
        if (envIsNode) {
            UsedConfig = {
                trace: genaricLog('trace'),
                warn: {
                    pre: Logger.prototype.banner({
                        content: name,
                        styles: [node_1.colors.black, node_1.colors.bgWhite]
                    }, {
                        content: 'warn',
                        styles: [node_1.colors.white, node_1.colors.bgYellow]
                    })
                },
                timeStamp: undefined,
                assert: genaricLog('assert'),
                count: genaricLog('count'),
                debug: genaricLog('debug'),
                dir: genaricLog('dir'),
                error: {
                    pre: Logger.prototype.banner({
                        content: name,
                        styles: [node_1.colors.black, node_1.colors.bgWhite]
                    }, {
                        content: 'error',
                        styles: [node_1.colors.white, node_1.colors.bgRed]
                    })
                },
                group: genaricLog('group'),
                groupCollapsed: genaricLog('groupCollapsed'),
                info: genaricLog('info'),
                log: {
                    pre: Logger.prototype.banner({
                        content: name,
                        styles: [node_1.colors.black, node_1.colors.bgWhite]
                    }, {
                        content: 'log',
                        styles: [node_1.colors.white, node_1.colors.bgGray]
                    })
                }
            };
        }
        else {
            UsedConfig = {
                trace: genaricLog('trace'),
                warn: {
                    pre: Logger.prototype.banner({ content: name }, { content: 'warn', backgroundColor: 'rgb(207, 162, 0)' })
                },
                timeStamp: undefined,
                assert: genaricLog('assert'),
                count: genaricLog('count'),
                debug: genaricLog('debug'),
                dir: genaricLog('dir'),
                error: {
                    pre: Logger.prototype.banner({ content: name }, { content: 'error', backgroundColor: 'rgb(190, 0, 0)' })
                },
                group: genaricLog('group'),
                groupCollapsed: genaricLog('groupCollapsed'),
                info: genaricLog('info'),
                log: {
                    pre: Logger.prototype.banner({ content: name }, { content: 'log', backgroundColor: 'gray' })
                }
            };
        }
        return new Logger(UsedConfig);
    };
    return Logger;
}());
/**
 * @ignore
 */
function genaricLog(type) {
    if (envIsNode) {
        return {
            pre: Logger.prototype.banner({
                content: 'ians-logger',
                styles: [node_1.colors.black, node_1.colors.bgWhite]
            }, { content: type, styles: [node_1.colors.white, node_1.colors.bgGray] }),
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
                styles: [node_1.colors.black, node_1.colors.bgWhite]
            }, {
                content: 'warn',
                styles: [node_1.colors.white, node_1.colors.bgYellow]
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
                styles: [node_1.colors.black, node_1.colors.bgWhite]
            }, { content: 'error', styles: [node_1.colors.white, node_1.colors.bgRed] })
        },
        group: genaricLog('group'),
        groupCollapsed: genaricLog('groupCollapsed'),
        info: genaricLog('info'),
        log: {
            pre: Logger.prototype.banner({
                content: 'ians-logger',
                styles: [node_1.colors.black, node_1.colors.bgWhite]
            }, { content: 'log', styles: [node_1.colors.white, node_1.colors.bgGray] })
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
exports.default = new Logger(DefaultConfig);
//# sourceMappingURL=ians-logger.js.map