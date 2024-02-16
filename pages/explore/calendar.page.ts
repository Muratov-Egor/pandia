import {Locator, Page} from "@playwright/test";
import {dateInCalendarFormat} from "../../utils/DateFormarter";
import {allure} from "allure-playwright";

export class CalendarPage {
  readonly page: Page;
  readonly calendarActionButton: Locator;

  private readonly date: string = 'xpath=//*[@data-test-id="date-*#*"]';

  constructor(page: Page) {
    this.page = page;
    this.calendarActionButton = page.getByTestId('calendar-action-button');
  }

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
      const currentData = this.date.replace('*#*', dateInCalendar);
      await this.page.locator(currentData).hover();
      await this.page.locator(currentData).click();
    });
  }
}
