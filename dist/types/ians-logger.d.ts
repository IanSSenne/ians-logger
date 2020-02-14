import { colors as NodeColors } from './node';
import { LoggerConfig, LoggerBannerSegment, NodeLoggerBannerSegment } from './ians-logger-types';
declare class Logger {
    config: LoggerConfig;
    colors: typeof NodeColors | undefined;
    constructor(fullConfig: LoggerConfig);
    banner(...segments: (LoggerBannerSegment | NodeLoggerBannerSegment)[]): string[];
    createLogger(config: LoggerConfig): Logger;
    private format;
    assert(assertion: any, ...message: any[]): void;
    count(label: string): void;
    countReset(label: string): void;
    debug(...message: any[]): void;
    dir(...message: any[]): void;
    dirxml(value: any): void;
    error(...message: any[]): void;
    group(...message: any[]): void;
    groupCollapsed(...message: any[]): void;
    info(...message: any[]): void;
    log(...message: any[]): void;
    time(label: string): void;
    timeEnd(label: string): void;
    timeStamp(label: string): void;
    trace(...message: any[]): void;
    warn(...message: any[]): void;
    createLoggerFromName(name: string): Logger;
}
declare const _default: Logger;
export default _default;
