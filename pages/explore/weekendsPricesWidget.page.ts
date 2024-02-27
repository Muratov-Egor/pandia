import {expect, Page} from "@playwright/test";
import {allure} from "allure-playwright";

export class WeekendsPricesWidget {
  readonly weekendsPriceWidget = this.page.getByTestId('weekends-prices-widget');
  readonly firstTicket = this.page.getByTestId('weekends-prices-ticket').first();
  readonly firstTicketLink = this.firstTicket.getByTestId('weekends-prices-ticket-link');
  readonly sortButton = this.page.getByTestId('weekends-sort-button');
  readonly sortDropdown = this.page.getByTestId('weekends-sort-dropdown');
  readonly priceOption = this.sortDropdown.getByTestId('price');
  readonly monthTitle = this.page.getByTestId('month-title').first();

  constructor(private readonly page: Page) {
  }

  async getFirstTicketLink() {
    return await allure.step('Получить ссылку на первый билет', async () => {
      return this.firstTicketLink.getAttribute('href');
    });
  }

  async chooseFirstTicket() {
    await allure.step('Выбрать первый билет', async () => {
      await this.firstTicket.click();
    });
  }

  async sortResultByPrice() {
    await allure.step('Отсортировать результаты по цене', async () => {
      await this.sortButton.click();
      await this.priceOption.click();
    });
  }

  async assertThatResultSortByMonth() {
    await allure.step('Результаты отсортированы по месяцам', async () => {
      await expect(this.monthTitle).toBeVisible();
    });
  }

  async assertThatResultSortByPrice() {
    await allure.step('Результаты отсортированы по цене', async () => {
      await expect(this.firstTicket).toBeVisible();
    });
  }

  async assertThatWidgetIsVisible() {
    await allure.step('Виджет "Билеты на выходные" отображается', async () => {
      await expect(this.weekendsPriceWidget).toBeVisible();
    });
  }
}
