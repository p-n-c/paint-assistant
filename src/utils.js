export const colours = {
  reset: '\x1b[0m',
  // Regular colors
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  purple: '\x1b[35m',

  // Bright colors
  brightBlack: '\x1b[90m',
  brightRed: '\x1b[91m',
  brightGreen: '\x1b[92m',
  brightYellow: '\x1b[93m',
  brightBlue: '\x1b[94m',
  brightPurple: '\x1b[95m',
}

export const statusCodes = [
  200, // default (success)
  404, // not found
]

export const hexColours = [
  {
    name: 'red',
    hex: '#ff0000',
  },
  {
    name: 'green',
    hex: '#008000',
  },
  {
    name: 'blue',
    hex: '#0000ff',
  },
  {
    name: 'white',
    hex: '#ffffff',
  },
]

export const colourise = (text, color) => `${color}${text}${colours.reset}`
