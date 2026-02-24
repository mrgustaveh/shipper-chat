import { format, formatDistanceToNowStrict } from "date-fns";
import { enGB } from "date-fns/locale";

interface FormatOpts {
  leading?: number;
  trailing?: number;
  delimiter?: string;
}

export const shortenString = (longstring: string, opts: FormatOpts = {}) => {
  const { leading = 4, trailing = 4, delimiter } = opts;

  const canonical = longstring;

  const l = Math.min(leading, canonical.length);
  const t = Math.min(trailing, canonical.length - l);

  return `${canonical.slice(0, l)}${
    delimiter ? delimiter : "…"
  }${canonical.slice(-t)}`;
};

export const dateFormat = (datestr: string): string => {
  return format(new Date(datestr), "eee do, MMM yyy", { locale: enGB });
};

export const dateDistanceToNow = (datestr: string): string => {
  return formatDistanceToNowStrict(new Date(datestr), {
    locale: enGB,
    addSuffix: true,
  });
};
