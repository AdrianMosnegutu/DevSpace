import { STATUS_CODE } from "./status-code";

export interface ExpressError extends Error {
  name: "ExpressError";
  code: STATUS_CODE;
}
