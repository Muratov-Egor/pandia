import {format} from "date-fns";
import {ru} from "date-fns/locale";

export const dateInCalendarFormat = date => {
  return format(date, 'dd.MM.yyyy')
}

export const dateInCollapsedFormFormat = date => {
  return format(date, 'yyyy-MM-dd')
}

export const dateInSearchForm = date => {
  return format(date, 'd\u00A0MMMM', {locale: ru})
}

export const dateInPriceChartFormat = date => {
  return format(date, 'yyyy-MM-dd')
}

export const selectMonthFormat = date => {
  return format(date, 'yyyy-MM')
}
