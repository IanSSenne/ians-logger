export interface LoggedFunctionConfig {
    pre: string[] | string;
}
export interface LoggerBannerSegment {
    content: string;
    color: string;
    backgroundColor?: string;
    css?: string;
}
export interface NodeLoggedFunctionConfig {
    pre: string;
    styles: Function[];
}
export interface NodeLoggerBannerSegment {
    content: string;
    styles: Function[];
}
export interface LoggerConfig {
    timeStamp?: Function;
    assert: LoggedFunctionConfig | NodeLoggedFunctionConfig;
    count: LoggedFunctionConfig | NodeLoggedFunctionConfig;
    debug: LoggedFunctionConfig | NodeLoggedFunctionConfig;
    dir: LoggedFunctionConfig | NodeLoggedFunctionConfig;
    error: LoggedFunctionConfig | NodeLoggedFunctionConfig;
    group: LoggedFunctionConfig | NodeLoggedFunctionConfig;
    groupCollapsed: LoggedFunctionConfig | NodeLoggedFunctionConfig;
    info: LoggedFunctionConfig | NodeLoggedFunctionConfig;
    log: LoggedFunctionConfig | NodeLoggedFunctionConfig;
    trace: LoggedFunctionConfig | NodeLoggedFunctionConfig;
    warn: LoggedFunctionConfig | NodeLoggedFunctionConfig;
}
