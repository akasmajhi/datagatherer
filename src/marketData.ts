import { createWriteStream } from "fs";
import * as path from "path";
import fetch from "node-fetch";

import { BASE_URL_NSE, DATA_DIR, MONTH_NAMES } from "./constants";

import {
  isYearValid,
  isMonthValid,
  isMonthInFuture,
  composeFetchURLForAMonth,
  deStructureURL,
} from "./utils/general";
import { isFileExisting, unzipFile } from "./utils/fileHandling";

const failedURLs: string[] = [];

let fetchAttempts = 0;

import logger from "./utils/logger";
const log = logger.log;
const moduleName: string = __filename.slice(
  __dirname.length + 1,
  __filename.length - 3
);

/**
 * Fetches the bhav copy for a month
 */
export const fetchBhavForAMonth = (year: string, month: string) => {
  const logAppend: string = `${moduleName}:fetchBhavForAMonth`;
  log(
    `${logAppend} Fetching bhav copy for month [${month}] of [${year}]`,
    "info"
  );
  // Is the year and month valid?
  if (
    !isYearValid(year) ||
    !isMonthValid(month) ||
    isMonthInFuture(year, month)
  ) {
    log(
      `${logAppend} Invalid date passed! Check year: [${year}] and month: [${month}]`,
      `error`
    );
    return false;
  }
  // Now fetch data for each day of the month
  const fetchURLs = composeFetchURLForAMonth(year, month);
  const promises = [];
  for (const fetchURL of fetchURLs) {
    promises.push(fetchDataFromURL(fetchURL));
  }
  Promise.all(promises).then((_) => {
    // results.forEach((result) => log(`result.status: ${result.status}`));
    log(
      `${logAppend}: [${year}] [${month}]. Total Fetch Attempts: [${fetchAttempts}]. \
                Total Failures: [${failedURLs.length}]`,
      "info"
    );
    failedURLs.forEach((failedURL) =>
      log(`${logAppend}: The [failed URL] [${failedURL}]`, `error`)
    );
  });
};

/**
 *
 * @param {*} year
 * @param {*} mon
 * @param {*} dayNumber
 */
export const fetchBhavCopy = (year: string, mon: string, dayNumber: string) => {
  const logAppend: string = `${moduleName}:fetchBhavCopy`;
  log(
    `${logAppend} Fetching for year: [${year}], mon: [${mon}], date: [${dayNumber}]`,
    "info"
  );
  // You are trying to fetch data for a month
  if (year && mon && dayNumber == undefined) fetchBhavForAMonth(year, mon);

  // Bhav for a year
  // if(year && mon == undefined && dayNumber == undefined) fetchBhavForAYear(year)
  // Input validation required here!
  const SEP = "/";
  if (year && mon && dayNumber) {
    // 'https://www1.nseindia.com/content/historical/EQUITIES/2021/JUL/cm11AUG2021bhav.csv.zip';
    // If a single-digit day number is passed
    const dayNum =
      parseInt(dayNumber) < 10
        ? `0${parseInt(dayNumber)}`
        : parseInt(dayNumber).toString();
    const fetchURL =
      `${BASE_URL_NSE}` +
      SEP +
      year +
      SEP +
      mon +
      SEP +
      "cm" +
      dayNum +
      mon +
      year +
      "bhav.csv.zip";
    log(`${logAppend} fetchURL: [${fetchURL}]`, "info");
    fetchDataFromURL(fetchURL);
  }
  if (year == undefined && mon == undefined && dayNumber == undefined) {
    // Fetch bhav copy for the current date
    const today = new Date();
    const year = today.getFullYear();
    const mon = MONTH_NAMES[today.getMonth()];
    const dayNumber =
      today.getDate() < 10 ? `0${today.getDate()}` : today.getDate();
    const fetchURL =
      `${BASE_URL_NSE}` +
      SEP +
      year +
      SEP +
      mon +
      SEP +
      "cm" +
      dayNumber +
      mon +
      year +
      "bhav.csv.zip";
    log(`${logAppend}: fetchURL [${fetchURL}]`, "info");
    fetchDataFromURL(fetchURL);
  }
};

/**
 *
 * @param {String} fetchURL - The URL of the (ZIP) file to be fetched
 * TBD: Better logging
 */
const fetchDataFromURL = async (fetchURL: string) => {
  const logAppend: string = `${moduleName}:fetchDataFromURL`;
  log(`${logAppend} fetchURL: [${fetchURL}]`, "debug");

  if (!fetchURL) return null;
  const { day, month, year, fileName } = deStructureURL(fetchURL, "NSE")!;
  log(
    `${logAppend} day: [${day}], month: [${month}] year: [${year}] fileName: [${fileName}]`,
    `debug`
  );
  if (!day || !month || !year || !fileName) {
    log(`${logAppend} You have provided a SHIT URL: [${fetchURL}]`, `error`);
    return null;
  }
  //const {year, mon, zipFileName} = deStructureURL(fetchURL, 'NSE');
  log(
    `${logAppend} day: [${day}], month: [${month}], year: [${year}] fileName: [${fileName}]. `,
    "debug"
  );
  // Is the year future?
  if (!isYearValid) {
    log(`${logAppend} Invalid year: ${year}`, "error");
    return null;
  }
  // is this a valid month?
  if (!isMonthValid) {
    log(`${logAppend} Invalid month: '${month}' is passed`, "error");
    return null;
  }
  // If date is today and time is not yet 7 PM
  // do not fetch the file
  if (new Date().getDate() == parseInt(day) && new Date().getHours() < 18) {
    log(
      `${logAppend}: Fetching for today [${day}-${month}-${year}] but before 6 PM. Discarding Fetch!`,
      "error"
    );
    return null;
  }
  if (
    isFileExisting(
      path.join(DATA_DIR, fileName.substring(0, fileName.length - 4))
    )
  )
    return;
  log(
    `${logAppend}: file: [${path.join(
      DATA_DIR,
      fileName.substring(0, fileName.length - 4)
    )}] Does not exist. fetching now.`,
    "info"
  );
  return fetch(fetchURL, {
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      fetchAttempts += 1;
      if (res.ok) {
        const destinationFile = path.join(DATA_DIR, fileName);
        log(
          `${logAppend}: Going to create destination file: [${destinationFile}]`,
          "info"
        );
        const dest = createWriteStream(destinationFile);
        res.body.pipe(dest);
        dest.on("close", () => {
          // Stream Closed: Let's try calling the down-stream jobs here.`);
          unzipFile(DATA_DIR, fileName);
        });
      } else {
        failedURLs.push(fetchURL);
        log(
          `${logAppend} Something went wrong for file: [${fileName}] \
                status code: [${res.status}] status text: [${res.statusText}]`,
          "error"
        );
        if (res.status == 404)
          log(`${logAppend}: File: [${fileName}] Not Found`, "error");
      }
    })
    .catch((error) => {
      failedURLs.push(fetchURL);
      log(`${logAppend}: Error for URL [${fetchURL}]`, "error");
      log(`${logAppend}: Full error text: ${error}`), "error";
    });
};

/*
const fetchBhavForAYear = year => {
    log(`Going to fetch bhav for the year ${year}`, 'debug');
    if (isYearValid(year)){
        for(let month of MONTH_NAMES){
            log(`fetching bhav for year [${year}] and month [${month}]`, 'info');
            fetchBhavForAMonth(year, month);
        }
    }
}
*/
