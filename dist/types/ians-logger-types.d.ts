export interface LoggedFunctionConfig {
    pre: string[] | string;
}
export interface LoggerBannerSegment {
    content: string;
    color: string;
    backgroundColor?: string;
    css?: string;
}
export interface LoggerConfig {
    timeStamp?: Function;
    assert: LoggedFunctionConfig;
    count: LoggedFunctionConfig;
    debug: LoggedFunctionConfig;
    dir: LoggedFunctionConfig;
    error: LoggedFunctionConfig;
    group: LoggedFunctionConfig;
    groupCollapsed: LoggedFunctionConfig;
    info: LoggedFunctionConfig;
    log: LoggedFunctionConfig;
    trace: LoggedFunctionConfig;
    warn: LoggedFunctionConfig;
}
