// import {fetchBhavCopy} from './marketData';
import { fetchBhavForAMonth, fetchIndicesForAMonth } from "./marketData";
import { MONTH_NAMES } from "./constants";

import logger from "./utils/logger";
const log = logger.log;
const moduleName: string = __filename.slice(
  __dirname.length + 1,
  __filename.length - 3
);
const logAppend: string = `${moduleName}:fetchBhavForAMonth`;

const dt = new Date();
const currentYear = dt.getFullYear();
// const currentMonth = 'JUN';
const currentMonth = MONTH_NAMES[dt.getMonth()];
const dayOfMonth = dt.getDate();
const dayOfMonthStr: string =
  dayOfMonth < 10 ? `0${dayOfMonth}` : dayOfMonth.toString();
// The default behaviour is to fetch the bhav copy
// for the current year and month.
log(
  `${logAppend} Fetching data for year: [${currentYear}] month: [${currentMonth}] day: [${dayOfMonthStr}]`,
  "banner"
);
log(
  `${logAppend} The default behaviour is to fetch the bhavcopy for the current month: [${currentMonth}]`,
  "banner"
);
log(
  `${logAppend} If you wish to change the default behaviour, change "index.ts" file`,
  "banner"
);

// fetchBhavCopy(`${currentYear}`, `OCT`);
// fetchBhavForAMonth('2023', 'MAY' );
// fetchBhavCopy(`${currentYear}`, `${currentMonth}`, `${dayOfMonthStr}`);
// fetchBhavCopy(`${currentYear}`, `${currentMonth}`, `11`);
fetchBhavForAMonth(`${currentYear}`, `${currentMonth}`);
fetchIndicesForAMonth(`${currentYear}`, `${currentMonth}`);
