import { DateTime } from "luxon";

export function parseDateLeft(isoDate) {
  const expiryDate = DateTime.fromISO(isoDate);
  const now = DateTime.now();
  const diff = expiryDate.diff(now);
  const duration = diff.shiftTo('years', 'months', 'days', 'hours')
  let toPlural = (num, text) => num > 1 ? text : text.slice(0, -1);
  const { years, months, days, hours, minutes, seconds } = duration
  
  for(let [typeOfTime, value] of Object.entries( { years, months, days, hours, minutes, seconds })) {
    if (value > 0) {
      return {
        message: `${value} ${toPlural(value, typeOfTime)}`,
        type: typeOfTime,
        value
      }
    }
  }
  return {
    message: null,
    type: null,
    value: null
  }
}
