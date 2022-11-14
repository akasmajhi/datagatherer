import * as path from "path";
import { BASE_URL_NSE, MONTH_NAMES, NSE_HOLIDAYS_2022_STR } from "../constants";
import logger from "./logger";
import { destructuredURL } from "../types";

const log = logger.log;
const moduleName: string = __filename.slice(
  __dirname.length + 1,
  __filename.length - 3
);
/**
 *
 * @param {String} fetchURL - returns the different parts of the URL
 * example: fetchURL = 'https://www1.nseindia.com/content/historical/EQUITIES/2021/AUG/cm11AUG2021bhav.csv.zip'
 */
export const deStructureURL = (
  fetchURL: string,
  exchange: string | undefined
): destructuredURL | undefined => {
  const logAppend: string = `${moduleName}:deStructureURL:`;
  log(
    `${logAppend} Beginning: fetchURL: [${fetchURL}] exchange: [${exchange}]`,
    `debug`
  );
  if (fetchURL && exchange) {
    switch (exchange) {
      // Each URL pattern is specific to an exchange
      case "NSE": // NSE specific implementation
        const urlParts = fetchURL.split(BASE_URL_NSE);
        if (urlParts) {
          log(`${logAppend} urlParts[1]: [${urlParts[1]}]`, "debug");
          if (!urlParts[1]) {
            log(`${logAppend} Badly formed URL passed: $[{fetchURL}]`, `error`);
            return undefined;
          }
          const [_, year, month, fileName] = urlParts[1].split("/");
          const day = fileName.substring(2, 4);
          if (year && month && fileName) {
            return { day, month, year, fileName };
          } else {
            log(`${logAppend} Badly formed URL passed: $[{fetchURL}]`, `error`);
            return undefined;
          }
        }
        log(
          `${logAppend} Badly formed fetchURL: [${fetchURL}] passed`,
          "error"
        );
        return undefined;
      case "BSE": // BSE specific implementation
        log(`${logAppend} Exchange: [${exchange}] Not Implemented`, `error`);
        break;
      default:
        log(`${logAppend} must provide an exchange`, `error`);
    }
  }
  log(`${logAppend} Both fetchURl and exchange cannot be null!`, `error`);
  return undefined;
};
/**
 * returns true if if it is not a weekday and not a NSE exchange holiday
 */
export const tradingHoliday = (
  year: string,
  month: string,
  day: string | number
): boolean => {
  const logAppend: string = `${moduleName}:tradingHoliday:`;
  log(
    `${logAppend}: Input [year, month, day]: [${year}, ${month}, ${day}]`,
    "debug"
  );
  const tradingDay = new Date(
    Number(year),
    MONTH_NAMES.indexOf(month),
    Number(day)
  );
  const tradingDayNum = tradingDay.getDay();
  if (tradingDayNum == 0 || tradingDayNum == 6) {
    log(`${logAppend}: Weekend passed and it is: [${tradingDay}]`, "debug");
    return true;
  }
  let _day = "";
  if (typeof day === "number") {
    _day = day < 10 ? `0${day}` : day.toString();
  } else {
    _day = day.toString();
  }
  // The above logic has a flaw: What if the day is passes as '4'?
  // TODO: Fix the above bug: later
  // (Number(day) && (Number(day) < 10) ) ? _day = `0${day}` : _day = day;
  const tradingDayStr = `${_day}-${month}-${year}`;
  log(`${logAppend} Trading day composed: ${tradingDayStr}`, `debug`);
  if (NSE_HOLIDAYS_2022_STR.includes(tradingDayStr)) {
    log(`${logAppend} [${tradingDayStr}]: is a holiday`, `debug`);
    return true;
  }
  return false;
};
/**
 * Given a year and a month, this function returns an array of fetch URLs
 * for the exchange. Currently, the exchange is defaulted to NSE
 */
export const composeFetchURLForAMonth = (
  year: string,
  month: string,
  exchange: string = "NSE"
): string[] => {
  const logAppend: string = `${moduleName}:composeFetchURLForAMonth:`;
  log(`${logAppend} You have passed exchange as: [${exchange}]`, `debug`);
  log(
    `${logAppend} Year is: [${year}] Month is: [${month}] Exchange is: [${exchange}]`,
    "debug"
  );
  const fetchURLs = [];
  const currentDate = new Date();
  let dayStr = "";
  const currentYear = currentDate.getFullYear();
  log(
    `${logAppend} month in numeric: [${MONTH_NAMES.indexOf(month) + 1}]`,
    "debug"
  );
  const daysInMonth = new Date(
    currentYear,
    MONTH_NAMES.indexOf(month) + 1,
    0
  ).getDate();
  log(`${logAppend} daysInMonth: [${daysInMonth}]`, "debug");
  for (let day = 1; day <= daysInMonth; day++) {
    let fetchURL = "";
    // DONE: what if the current date is in future
    if (new Date(`${year}-${month}-${dayStr}`) > currentDate) return fetchURLs;
    dayStr = day < 10 ? `0${day}` : `${day}`;
    if (!tradingHoliday(year, month, day)) {
      // Is this a NSE holiday?
      fetchURL =
        `${BASE_URL_NSE}/` +
        path.join(year, month, `cm${dayStr}${month}${year}bhav.csv.zip`);
      log(
        `composeFetchURLForAMonth: The URL composed is: [${fetchURL}]`,
        `info`
      );
      fetchURLs.push(fetchURL);
    }
  }
  return fetchURLs;
};
/**
 * Expects a month in the form of MON
 * Only string months are allowed.
 * The length needs to be 3 chars.
 * Valid months are defined the staic array as above
 */

export const isMonthValid = (month: string | number): boolean => {
  const logAppend: string = `${moduleName}:isMonthValid:`;
  if (month && typeof month === "string") {
    const monthIdx = MONTH_NAMES.findIndex((mon) => mon == month.toUpperCase());
    if (monthIdx < 0) {
      log(`${logAppend} Valid month values are ${MONTH_NAMES}`, "error");
      return false;
    }
    return true;
  } else if (month && typeof month === "number") {
    return MONTH_NAMES[month - 1] ? true : false; // in case someone passes 1 for JAN, 2 for FEB, etc.
  } else {
    // some month passes that I cannot understand
    log(`${logAppend} Invalid month: [${month}] passed`, `error`);
    return false;
  }
};
/**
 * For a given year, the month cannot be in future
 */
export const isMonthInFuture = (year: string, mon: string) => {
  const logAppend: string = `${moduleName}:isMonthInFuture`;
  const monthIdx = MONTH_NAMES.findIndex(
    (month) => month === mon.toUpperCase()
  );
  if (
    parseInt(year) === new Date().getFullYear() &&
    monthIdx > new Date().getMonth()
  ) {
    log(
      `${logAppend} You cannot pass a future month [${mon}] for the current year: [${year}]!`,
      "error"
    );
    return true;
  }
  return false;
};
/**
 * Expects a year in the form of YYYY
 * Only string years are allowed.
 * You cannot pass a year in future
 */
export const isYearValid = (year: string | number): boolean => {
  const logAppend: string = `${moduleName}:isMYearValid:`;
  if (year && typeof year === "string") {
    if (year.length !== 4) {
      log(`${logAppend} Invalid year: ${year} passed`, "error");
      return false;
    }
    // Is the year in future?
    if (parseInt(year) > new Date().getFullYear()) {
      log(`${logAppend} Future year: ${year} passed`, "error");
      return false;
    }
    return true;
  }
  return false;
};
/**
 * @param {String} year - The duration for which the URLs are required
 * @param {String} args - The value of the duration. Year: any four-digit number.
 *                       Month: any 2-digit number - 01-12
 */
export const composeFetchURL = (
  year: string,
  month: string,
  exchange: string = "NSE"
) => {
  // Check if the duration is month or year
  // Case insensitive check
  const logAppend: string = `${moduleName}:composeFetchURL:`;
  if (!year && !month) {
    log(
      `${logAppend}: null values not permitted for year: '${year}' `,
      "error"
    );
    return;
  }
  if (isYearValid(year) && isMonthValid(month)) {
    return composeFetchURLForAMonth(year, month);
  } else {
    log(
      `Invalid parameter provided: ${year}. Permitted are year and month`,
      "error"
    );
    return false;
  }
};
