import * as path from "path";
export const BASE_DIR = "/home/akasmajhi/data";
export const DATA_DIR = path.join(BASE_DIR, "NSE", "bhavcopy");
export const INDICES_DATA_DIR = path.join(BASE_DIR, "NSE", "indices");
// export const BASE_URL_NSE = `https://www1.nseindia.com/content/historical/EQUITIES`;
// The URL changed on 01-PAR since the NSE website is changed now
export const BASE_URL_NSE = `https://archives.nseindia.com/content/historical/EQUITIES`;
// Market data is not available till this cut-off time: 6.30 PM
export const CUTOFF_TIME = 18 * 60 + 30;
export const MONTH_NAMES = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

export const CSV_HEADER_ROW = [
  "symbol",
  "series",
  "open",
  "high",
  "low",
  "close",
  "last",
  "previous_close",
  "total_traded_quantity",
  "total_traded_value",
  "timestamp",
  "total_trades",
  "isin",
];
export const NSE_HOLIDAYS_2022_STR = [
  "26-JAN-2022",
  "01-MAR-2022",
  "18-MAR-2022",
  "14-APR-2022",
  "15-APR-2022",
  "03-MAY-2022",
  "09-AUG-2022",
  "15-AUG-2022",
  "31-AUG-2022",
  "05-OCT-2022",
  "26-OCT-2022",
  "08-NOV-2022",
];
export const NSE_HOLIDAYS_2023_STR = [
  "26-JAN-2023",
  "07-MAR-2023",
  "30-MAR-2023",
  "04-APR-2023",
  "07-APR-2023",
  "14-APR-2023",
  "01-MAY-2023",
  "28-JUN-2023",
  "15-AUG-2023",
  "19-SEP-2023",
  "02-OCT-2023",
  "24-OCT-2023",
  "14-NOV-2023",
  "27-NOV-2023",
  "25-DEC-2023",
];

export const BHAV_POST_URL = "http://127.0.0.1:13333/api/bhav/";
export const DAILY_BHAV_URL = "http://127.0.0.1:13333/api/dailybhav/";
