/**
 * @ignore
 */
function makeColor(opening: number, closing: number) {
  const func = function(msg: string) {
    return `\u001b[${opening}m${msg}\u001b[${closing}m`
  }
  Object.defineProperty(func, 'start', { value: opening, configurable: false, writable: false })
  Object.defineProperty(func, 'stop', { value: closing, configurable: false, writable: false })
  return func
}
export const colors = {
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
}
export function isNode() {
  try {
    return !window
  } catch {
    return true
  }
}
