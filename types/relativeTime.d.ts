//@ts-nocheck
//eslint-disable-next-line
import dayjs from "dayjs";

declare module "dayjs" {
  interface Dayjs {
    fromNow(withoutSuffix?: boolean): string;
  }
}
