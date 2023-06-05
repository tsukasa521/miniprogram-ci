import chalk from "chalk";
import { Command } from "commander";
import util from "util";

export class Logger {
  constructor() { }

  static debug(message?: any, ...optionalParams: any[]) {
    // todo 处理 Command 
    console.debug(message, ...optionalParams)
  }

  static info(message?: any, ...optionalParams: any[]) {
    console.info(message, ...optionalParams)
  }

  static error(message?: any, ...optionalParams: any[]) {
    console.error(message, ...optionalParams)
  }

  private static innerLog(message: any) {

    if (Array.isArray(message)) {
      return message.map(p => {
        if (p instanceof Command) {
          return 'Command'
        } else if (typeof p === 'object') {
          const output = util.inspect(p, { colors: true })
          return output
        }
        else {
          return p
        }
      })
    } else {
      return message
    }
  }
}