import deepmerge from 'deepmerge'
import { colors as NodeColors, isNode } from './node'
const envIsNode = isNode()
// console.log(
//   NodeColors.bgBlue(NodeColors.cyan('TEST')),
//   JSON.stringify(NodeColors.bgBlue(NodeColors.cyan('TEST')))
// )
import {
  LoggerConfig,
  LoggedFunctionConfig,
  LoggerBannerSegment,
  NodeLoggerBannerSegment,
  NodeLoggedFunctionConfig
} from './ians-logger-types'
let DefaultConfig: LoggerConfig
function flat(arr: any) {
  let res = []
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].constructor === Array) {
      res.push(...arr[i])
    } else {
      res.push(arr[i])
    }
  }
  return res
}
class Logger {
  config: LoggerConfig
  colors: typeof NodeColors | undefined
  constructor(fullConfig: LoggerConfig) {
    this.config = fullConfig
    if (envIsNode) {
      this.colors = NodeColors
    }
  }
  public banner(...segments: (LoggerBannerSegment | NodeLoggerBannerSegment)[]): string[] {
    if (envIsNode) {
      let str = ''
      for (let segment of segments) {
        let current = <NodeLoggerBannerSegment>segment
        let result = current.content
        for (let style of current.styles) {
          result = style(result)
        }
        str += result
      }
      return [str]
    } else {
      if (segments.length === 1) {
        const segment = <LoggerBannerSegment>segments[0]
        return [
          `%c ${segment.content} %c`,
          `background:${segment.backgroundColor ||
            '#35495e'}; padding: 1px; border-radius: 3px 3px 3px 3px;  color: ${segment.color ||
            '#fff'};${segment.css || ''}`,
          `background:transparent`
        ]
      } else if (segments.length === 2) {
        const segment = <LoggerBannerSegment>segments[0]
        const last = <LoggerBannerSegment>segments[1]
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
        const text =
          '%c ' +
          (<LoggerBannerSegment[]>segments)
            .map((segment: LoggerBannerSegment) => segment.content)
            .join(' %c ') +
          ' %c'
        const first: LoggerBannerSegment = <LoggerBannerSegment>segments.shift()
        const last: LoggerBannerSegment = <LoggerBannerSegment>segments.pop()
        const segment = [text]
        segment.push(
          `background:${first.backgroundColor ||
            '#35495e'}; padding: 1px; border-radius: 3px 0px 0px 3px;  color: ${first.color ||
            '#fff'};${first.css || ''}`
        )
        for (let i = 0; i < segments.length; i++) {
          const current = <LoggerBannerSegment>segments[i]
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
    }
    return []
  }
  public createLogger(config: LoggerConfig) {
    const computedConfig: LoggerConfig = deepmerge(DefaultConfig, config)
    return new Logger(computedConfig)
  }

  private format(conf: LoggedFunctionConfig, args: string[]): string[] {
    if (envIsNode) {
      if (typeof conf.pre === 'string') {
        conf.pre = [conf.pre]
      }
      if (this.config.timeStamp) {
        const msg: string[] = Array.from(conf.pre)
        msg[0] = this.config.timeStamp() + ' ' + msg[0]
        return flat([msg, args])
      } else {
        return flat([conf.pre, args])
      }
    } else {
      if (typeof conf.pre === 'string') {
        conf.pre = [conf.pre]
      }
      if (this.config.timeStamp) {
        const msg: string[] = Array.from(conf.pre)
        msg[0] = this.config.timeStamp() + ' ' + msg[0]
        return flat([msg, args])
      } else {
        return flat([conf.pre, args])
      }
    }
  }
  assert(assertion: any, ...message: any[]) {
    if (!assertion) {
      console.log(...this.format(this.config.assert, flat(['Assertion failed:', message])))
    }
  }
  count(label: string) {
    console.count(label)
  }
  countReset(label: string) {
    console.countReset(label)
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
    console.log(...this.format(this.config.error, message))
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
    console.trace(...this.format(this.config.trace, message))
  }
  warn(...message: any[]) {
    console.log(...this.format(this.config.warn, message))
  }
  createLoggerFromName(name: string) {
    function genericLog(type: string): LoggedFunctionConfig {
      return {
        pre: Logger.prototype.banner(
          <LoggerBannerSegment>{ content: name },
          <LoggerBannerSegment>{ content: type, backgroundColor: 'gray' }
        )
      }
    }
    return new Logger({
      trace: genericLog('trace'),
      warn: {
        pre: Logger.prototype.banner(
          <LoggerBannerSegment>{ content: name },
          <LoggerBannerSegment>{ content: 'warn', backgroundColor: 'rgb(207, 162, 0)' }
        )
      },

      timeStamp: undefined,
      assert: genericLog('assert'),
      count: genericLog('count'),
      debug: genericLog('debug'),
      dir: genericLog('dir'),
      error: {
        pre: Logger.prototype.banner(
          <LoggerBannerSegment>{ content: name },
          <LoggerBannerSegment>{ content: 'error', backgroundColor: 'rgb(190, 0, 0)' }
        )
      },
      group: genericLog('group'),
      groupCollapsed: genericLog('groupCollapsed'),
      info: genericLog('info'),
      log: {
        pre: Logger.prototype.banner(
          <LoggerBannerSegment>{ content: name },
          <LoggerBannerSegment>{ content: 'log', backgroundColor: 'gray' }
        )
      }
    })
  }
}

function genaricLog(type: string): LoggedFunctionConfig | NodeLoggedFunctionConfig {
  if (envIsNode) {
    return {
      pre: Logger.prototype.banner(
        <NodeLoggerBannerSegment>{
          content: 'ians-logger',
          styles: [NodeColors.black, NodeColors.bgWhite]
        },
        <NodeLoggerBannerSegment>{ content: type, styles: [NodeColors.white, NodeColors.bgGray] }
      ),
      styles: new Array<Function>()
    }
  } else {
    return <LoggedFunctionConfig>{
      pre: Logger.prototype.banner(
        <LoggerBannerSegment>{ content: 'ians-logger' },
        <LoggerBannerSegment>{ content: type, backgroundColor: 'gray' }
      )
    }
  }
}

if (envIsNode) {
  DefaultConfig = {
    trace: genaricLog('trace'),
    warn: {
      pre: Logger.prototype.banner(
        <NodeLoggerBannerSegment>{
          content: 'ians-logger',
          styles: [NodeColors.black, NodeColors.bgWhite]
        },
        <NodeLoggerBannerSegment>{
          content: 'warn',
          styles: [NodeColors.white, NodeColors.bgYellow]
        }
      )
    },

    timeStamp: undefined,
    assert: genaricLog('assert'),
    count: genaricLog('count'),
    debug: genaricLog('debug'),
    dir: genaricLog('dir'),
    error: {
      pre: Logger.prototype.banner(
        <NodeLoggerBannerSegment>{
          content: 'ians-logger',
          styles: [NodeColors.black, NodeColors.bgWhite]
        },
        <NodeLoggerBannerSegment>{ content: 'error', styles: [NodeColors.white, NodeColors.bgRed] }
      )
    },
    group: genaricLog('group'),
    groupCollapsed: genaricLog('groupCollapsed'),
    info: genaricLog('info'),
    log: {
      pre: Logger.prototype.banner(
        <NodeLoggerBannerSegment>{
          content: 'ians-logger',
          styles: [NodeColors.black, NodeColors.bgWhite]
        },
        <NodeLoggerBannerSegment>{ content: 'log', styles: [NodeColors.white, NodeColors.bgGray] }
      )
    }
  }
} else {
  DefaultConfig = {
    trace: genaricLog('trace'),
    warn: {
      pre: Logger.prototype.banner(
        <LoggerBannerSegment>{ content: 'ians-logger' },
        <LoggerBannerSegment>{ content: 'warn', backgroundColor: 'rgb(207, 162, 0)' }
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
        <LoggerBannerSegment>{ content: 'log', backgroundColor: 'gray' }
      )
    }
  }
}
export default new Logger(DefaultConfig)
