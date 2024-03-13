import {expect, Page} from "@playwright/test";
import {allure} from "allure-playwright";

export class TravelMapPage {
  constructor(private readonly page: Page) {
  }

  readonly travelModal = this.page.getByTestId('travel-map-modal');

  async assertThatTravelModalIsOpened() {
    await allure.step('Модальное окно Travel Map открыто', async () => {
      await expect(this.travelModal).toBeVisible();
    });
  }
}
