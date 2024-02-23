import {nextMonth, nextWeek, today} from "../utils/GetDate";
import {IataCityCode} from "../enums/IataCityCode";

export const firstSegment = {
  segmentNumber: 1,
  origin: IataCityCode.MOW,
  destination: IataCityCode.IST,
  date: today
}
export const secondSegment = {
  segmentNumber: 2,
  origin: IataCityCode.IST,
  destination: IataCityCode.LON,
  date: nextWeek
}
export const thirdSegment = {
  segmentNumber: 3,
  origin: IataCityCode.LON,
  destination: IataCityCode.NYC,
  date: nextMonth
}
