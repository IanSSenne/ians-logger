import deepmerge from 'deepmerge'
// function deepmerge(a: any, b: any) {
//   return Object.assign(a, b)
// }
var __spreadArrays = function(a: any, b: any) {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length
  for (var r = Array(s), k = 0, i = 0; i < il; i++)
    for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j]
  return r
}
import { LoggerConfig, LoggedFunctionConfig, LoggerBannerSegment } from './ians-logger-types'
let DefaultConfig: LoggerConfig
function flat<T>(arr: any[]): T[] {
  let res = []
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].constructor === Array) {
      res.push(...flat(arr[i]))
    } else {
      res.push(arr[i])
    }
  }
  return res
}
class Logger {
  config: LoggerConfig
  constructor(fullConfig: LoggerConfig) {
    this.config = fullConfig
  }
  public banner(...segments: LoggerBannerSegment[]): string[] {
    if (segments.length === 1) {
      const segment = segments[0]
      //'background:#35495e ; padding: 1px; border-radius: 3px 3px 3px 3px;  color: #fff', "background: gray; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff", 'background:transparent'),
      return [
        `%c ${segment.content} %c`,
        `background:${segment.backgroundColor ||
          '#35495e'}; padding: 1px; border-radius: 3px 3px 3px 3px;  color: ${segment.color ||
          '#fff'};${segment.css || ''}`,
        `background:transparent`
      ]
    } else if (segments.length === 2) {
      const segment = segments[0]
      const last = segments[1]
      return [
        `%c ${segment.content} %c ${last.content} %c `,
        `background:${segment.backgroundColor ||
          '#35495e'}; padding: 1px; border-radius: 3px 0px 0px 3px;  color: ${segment.color ||
          '#fff'};${segment.css || ''}`,
        `background: ${last.backgroundColor ||
          'gray'}; padding: 1px; border-radius: 0 3px 3px 0;  color: ${last.color ||
          '#fff'};${last.css || ''}`,
        `background:transparent`
      ]
    } else if (segments.length > 2) {
      const text = '%c ' + segments.map(segment => segment.content).join(' %c ') + ' %c'
      const first: LoggerBannerSegment = <LoggerBannerSegment>segments.shift()
      const last: LoggerBannerSegment = <LoggerBannerSegment>segments.pop()
      const segment = [text]
      segment.push(
        `background:${first.backgroundColor ||
          '#35495e'}; padding: 1px; border-radius: 3px 0px 0px 3px;  color: ${first.color ||
          '#fff'};${first.css || ''}`
      )
      for (let i = 0; i < segments.length; i++) {
        const current = segments[i]
        segment.push(
          `background:${current.backgroundColor ||
            '#35495e'}; padding: 1px;  color: ${current.color || '#fff'};${current.css || ''}`
        )
      }
      segment.push(
        `background:${last.backgroundColor ||
          'gray'}; padding: 1px; border-radius: 0px 3px 3px 0px;  color: ${last.color ||
          '#fff'};${last.css || ''}`,
        `background:transparent`,
        ` `
      )
      return segment
    }
    return []
  }
  public createLogger(config: LoggerConfig) {
    const computedConfig: LoggerConfig = deepmerge(DefaultConfig, config)
    return new Logger(computedConfig)
  }

  format(conf: LoggedFunctionConfig, args: string[]): string[] {
    if (typeof conf.pre === 'string') {
      conf.pre = [conf.pre]
    }
    if (this.config.timeStamp) {
      const msg: string[] = Array.from(conf.pre)
      msg[0] = this.config.timeStamp() + ' ' + msg[0]
      return flat<string>([msg, args])
    } else {
      return flat<string>([conf.pre, args])
    }
  }
  assert(assertion: any, ...message: any[]) {
    var _a = this.format(this.config.assert, message),
      _message = _a[0],
      rest = _a.slice(1)
    console.assert.apply(console, <any>__spreadArrays([assertion, _message], rest))
  }
  count(label: string) {
    console.count(label)
  }
  countReset() {
    console.countReset()
  }
  debug(...message: any[]) {
    console.debug(...this.format(this.config.debug, message))
  }
  dir(...message: any[]) {
    console.dir(...this.format(this.config.dir, message))
  }
  dirxml(value: any) {
    console.dirxml(value)
  }
  error(...message: any[]) {
    console.error(this.format(this.config.error, message))
  }
  group(...message: any[]) {
    console.group(...this.format(this.config.group, message))
  }
  groupCollapsed(...message: any[]) {
    console.groupCollapsed(...this.format(this.config.groupCollapsed, message))
  }
  info(...message: any[]) {
    console.info(...this.format(this.config.info, message))
  }
  log(...message: any[]) {
    console.log(...this.format(this.config.log, message))
  }
  time(label: string) {
    console.time(label)
  }
  timeEnd(label: string) {
    console.timeEnd(label)
  }
  timeStamp(label: string) {
    console.timeStamp(label)
  }
  trace(...message: any[]) {
    console.log(...this.format(this.config.trace, message))
  }
  warn(...message: any[]) {
    console.log(...this.format(this.config.warn, message))
  }
}

function genaricLog(type: string): LoggedFunctionConfig {
  return {
    pre: Logger.prototype.banner(
      <LoggerBannerSegment>{ content: 'ians-logger' },
      <LoggerBannerSegment>{ content: type, backgroundColor: 'red' }
    )
  }
}
DefaultConfig = {
  trace: genaricLog('trace'),
  warn: {
    pre: Logger.prototype.banner(
      <LoggerBannerSegment>{ content: 'ians-logger' },
      <LoggerBannerSegment>{ content: 'error', backgroundColor: 'rgb(207, 162, 0)' }
    )
  },

  timeStamp: undefined,
  assert: genaricLog('assert'),
  count: genaricLog('count'),
  debug: genaricLog('debug'),
  dir: genaricLog('dir'),
  error: {
    pre: Logger.prototype.banner(
      <LoggerBannerSegment>{ content: 'ians-logger' },
      <LoggerBannerSegment>{ content: 'error', backgroundColor: 'rgb(190, 0, 0)' }
    )
  },
  group: genaricLog('group'),
  groupCollapsed: genaricLog('groupCollapsed'),
  info: genaricLog('info'),
  log: {
    pre: Logger.prototype.banner(
      <LoggerBannerSegment>{ content: 'ians-logger' },
      <LoggerBannerSegment>{ content: 'error', backgroundColor: 'gray' }
    )
  }
}
export default new Logger(DefaultConfig)
