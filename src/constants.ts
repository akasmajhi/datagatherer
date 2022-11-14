import * as path from "path";
export const BASE_DIR = "/mnt/x/market";
export const DATA_DIR = path.join(BASE_DIR, "NSE", "bhavcopy");
export const BASE_URL_NSE = `https://www1.nseindia.com/content/historical/EQUITIES`;

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

export const BHAV_POST_URL = "http://127.0.0.1:13333/api/bhav/";
export const DAILY_BHAV_URL = "http://127.0.0.1:13333/api/dailybhav/";
