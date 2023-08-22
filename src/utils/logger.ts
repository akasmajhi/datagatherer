import chalk from "chalk";

export default class Logging {
  static banner = (args: string) => {
    console.log(
      chalk.green(`[${new Date().toLocaleString()}] [banner] `),
      typeof args === "string" ? chalk.greenBright(args) : args
    );
  };
  static info = (args: string) => {
    console.log(
      chalk.blue(`[${new Date().toLocaleString()}] [info] `),
      typeof args === "string" ? chalk.blueBright(args) : args
    );
  };

  static warn = (args: string) => {
    console.log(
      chalk.yellow(`[${new Date().toLocaleString()}] [warn] `),
      typeof args === "string" ? chalk.yellowBright(args) : args
    );
  };

  static debug = (args: string) => {
    console.log(
      chalk.white(`[${new Date().toLocaleString()}] [debug] `),
      typeof args === "string" ? chalk.dim(args) : args
    );
  };
  static error = (args: string) => {
    console.log(
      chalk.red(`[${new Date().toLocaleString()}] [error] `),
      typeof args === "string" ? chalk.redBright(args) : args
    );
  };
  static performance = (args: string) => {
    console.log(
      chalk.cyan(`[${new Date().toLocaleString()}] [performance] `),
      typeof args === "string" ? chalk.cyanBright(args) : args
    );
  };
  static log = (
    message: string,
    logCategory: string | undefined = undefined
  ) => {
    switch (logCategory) {
      case "banner":
        this.banner(message);
        break;
      case "info":
        this.info(message);
        break;
      case "warn":
        this.warn(message);
        break;
      case "debug":
        this.debug(message);
        break;
      case "error":
        this.error(message);
        break;
      case "performance":
        this.performance(message);
        break;
      default:
        this.info(message);
    }
  };
}
