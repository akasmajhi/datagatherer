import { Url } from "url";

export type destructuredURL = {
  day: string;
  month: string;
  year: string;
  fileName: string;
};

export interface IExchange {
  name: string;
  BASE_URL: Url;
  status?: string;
}
const defaults: Pick<IExchange, "name"> = {
  name: "NSE",
};
