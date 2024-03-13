import {IataCityCode} from "../enums/IataCityCode";

// Все данные захардкожены в ../fixtures/explore/main_page_blocks.json
export  const hotTicketInfo = {
  origin: IataCityCode.MOW,
  destination: IataCityCode.HKT,
  data: new Date(2023, 8, 27) // год не важен, поэтому можно оставить 2023
}
