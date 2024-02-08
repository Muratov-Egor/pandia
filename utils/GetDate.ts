import {addDays, addMonths, addWeeks} from "date-fns";

export const today = new Date()

export const tomorrow = addDays(today, 1)

export const nextWeek = addWeeks(today, 1)

export const nextMonth = addMonths(today, 1)