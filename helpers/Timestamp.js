import moment from 'moment';

export function calendarize(ts) {
  return moment(ts).add(1, 'days').calendar();
};
