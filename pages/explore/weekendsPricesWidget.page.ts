import {expect, Page} from "@playwright/test";

export class WeekendsPricesWidget {
  readonly weekendsPriceWidget = this.page.getByTestId('weekends-prices-widget');
  readonly firstTicket = this.page.getByTestId('weekends-prices-ticket').first();
  readonly firstTicketLink = this.firstTicket.getByTestId('weekends-prices-ticket-link');
  readonly sortButton = this.page.getByTestId('weekends-sort-button');
  readonly sortDropdown = this.page.getByTestId('weekends-sort-dropdown');
  readonly departureDateOption = this.sortDropdown.getByTestId('departure_date');
  readonly priceOption = this.sortDropdown.getByTestId('price');
  readonly monthTitle = this.page.getByTestId('month-title');

  constructor(private readonly page: Page) {
  }

  async getFirstTicketLink() {
    return this.firstTicketLink.getAttribute('href');
  }

  async chooseFirstTicket() {
    await this.firstTicket.click();
  }

  async sortResultByPrice() {
    await this.sortButton.click();
    await this.priceOption.click();
  }

  async assertThatResultSortByMonth() {
    await expect(this.monthTitle).toBeVisible();
  }

  async assertThatResultSortByPrice() {
    await expect(this.monthTitle).not.toBeVisible();
  }

  async assertThatWidgetIsVisible() {
    await expect(this.weekendsPriceWidget).toBeVisible();
    await expect(this.firstTicket).toBeVisible();
  }
}
