import moment from 'moment';

export function calendarize(ts) {
  return moment(ts).calendar();
};
