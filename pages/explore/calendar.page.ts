import {Page} from "@playwright/test";
import {dateInCalendarFormat} from "../../utils/DateFormarter";
import {allure} from "allure-playwright";

export class CalendarPage {
  constructor(private readonly page: Page) {}

  readonly date = (date: string) => this.page.getByTestId(`date-${date}`)
  readonly calendarActionButton = this.page.getByTestId('calendar-action-button');

  async selectTripDurationDates(startDate: Date, endDate?: Date) {
    await allure.step(`Выбор даты вылета`, async () => {
      await this.chooseDate(startDate);
    });

    if (endDate) {
      await allure.step(`Выбор даты возвращения`, async () => {
        await this.chooseDate(endDate);
      });
    } else {
      await allure.step('Клик по кнопке "Обратный билет не нужен"', async () => {
        await this.calendarActionButton.click()
      });
    }
  }

  private async chooseDate(date: Date) {
    const dateInCalendar = dateInCalendarFormat(date);

    await allure.step(`Выбрать дату ${dateInCalendar}`, async () => {
      await this.date(dateInCalendar).hover();
      await this.date(dateInCalendar).click();
    });
  }
}
