import {Locator, Page} from "@playwright/test";
import {dateInCalendarFormat} from "../../utils/DateFormarter";

export class CalendarPage {
  readonly page: Page;
  readonly calendarActionButton: Locator;

  private readonly date: string = 'date-';

  constructor(page: Page) {
    this.page = page;
    this.calendarActionButton = page.getByTestId('calendar-action-button');
  }

  async selectTripDurationDates(startDate: Date, endDate?: Date) {
    await this.chooseDate(startDate);

    if (endDate) {
      await this.chooseDate(endDate);
    } else {
      await this.calendarActionButton.click()
    }
  }

  private async chooseDate(date: Date) {
    const dateInCalendar = dateInCalendarFormat(date);
    await this.page.getByTestId(this.date + dateInCalendar).hover();
    await this.page.getByTestId(this.date + dateInCalendar).click()
  }
}
