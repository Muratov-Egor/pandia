import {Page} from "@playwright/test";
import {allure} from "allure-playwright";

export class ExactMinPricesWidgetPage {
  constructor(private readonly page: Page) {}

  readonly showAllTicketsButton = this.page.getByTestId('show-all-tickets-button');
  readonly firstBestPricesTicket = this.page.getByTestId('best-prices-ticket').first();
  readonly stubNoPrices = this.page.getByTestId('stub-no-prices');
  readonly startSearchButton = this.stubNoPrices.getByTestId('button');

  async showAllTickets() {
    await allure.step('Нажать на кнопку "Показать все билеты"', async () => {
      await this.showAllTicketsButton.click();
    });
  }

  async chooseFirstPrice() {
    await allure.step('Выбрать первый билет', async () => {
      await this.firstBestPricesTicket.click();
    });
  }

  async startSearchFromStub() {
    await allure.step('Нажать на кнопку "Начать поиск" в заглушке "Нет билетов"', async () => {
      await this.startSearchButton.click();
    });
  }
}
