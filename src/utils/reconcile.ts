import logger from "./logger";
const log = logger.log;
const moduleName: string = __filename.slice(
  __dirname.length + 1,
  __filename.length - 3
);

export const reconcileBhavCopy = async (year: string, month: string, day: string) => {
  const logAppend: string = `${moduleName}:reconcileBhavCopy:`;
    log(`${logAppend}: Reconciling Market Data For: [[${year}]${month}][${day}]`, `banner`);
}
