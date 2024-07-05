import {expect, Page} from "@playwright/test";
import {allure} from "allure-playwright";

export class ResultPage {
  readonly ticketsList = this.page.getByTestId('search-results-items-list');
  readonly ticket = this.page.getByTestId('ticket-preview').first();
  readonly ticketSegmentRoute = this.ticket.getByTestId('ticket-segment-route');

  constructor(private readonly page: Page) {
  }

  async assertThatSearchResultContainsTickets() {
    await allure.step('Отображается выдача', async () => {
      await this.ticketsList.waitFor({ state: 'visible' });
      await this.ticket.waitFor({ state: 'visible' });
    });
  }

  async assertThatNumberOfSegmentsInTicketIs(segmentNumber: number) {
    await allure.step(`Количество сегментов в билете равно ${segmentNumber}`, async () => {
      const segments = await this.ticketSegmentRoute.all();
      expect(segments.length).toBe(segmentNumber);
    });
  }
}

