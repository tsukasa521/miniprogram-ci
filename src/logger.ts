import chalk from "chalk";
import { Command } from "commander";
import util from "util";

export class Logger {
  constructor() {

  }

  static debug(...message: any[]) {
    console.log(chalk.blueBright(this.innerLog(message)))
  }

  static info(...message: any[]) {
    console.log(chalk.greenBright(this.innerLog(message)))
  }

  static error(...message: any[]) {
    console.error(chalk.red(this.innerLog(message)))
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