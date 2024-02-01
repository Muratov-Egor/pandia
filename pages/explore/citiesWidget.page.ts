import {expect, Locator, Page} from '@playwright/test';
import {allure} from "allure-playwright";

export class CitiesWidgetPage {
  readonly page: Page;
  readonly cityList: Locator;
  readonly cityCard: Locator;
  readonly cityName: Locator;
  readonly allCityButton: Locator;
  readonly allCityModal: Locator;
  readonly cityCardInModal: Locator;
  readonly cityNameInModal: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cityList = page.getByTestId('city-list');
    this.cityCard = page.getByTestId('city-card').first();
    this.cityName = this.cityCard.getByTestId('city-name');
    this.allCityButton = page.getByTestId('all-city-button');
    this.allCityModal = page.getByTestId('all-cities-modal');
    this.cityCardInModal = this.allCityModal.getByTestId('city-card').first();
    this.cityNameInModal = this.cityCardInModal.getByTestId('city-name');
  }

  async selectCity(isModal = false) {
    await allure.step('Select city', async () => {
      const cityCard = isModal ? this.cityCardInModal : this.cityCard;
      await cityCard.click();
    });
  }

  async getCityName(isModal = false) {
    return allure.step('Get city name', async () => {
      return isModal ? await this.cityNameInModal.textContent() : await this.cityName.textContent();
    });
  }

  async openAllCitiesModal() {
    await allure.step('Open all cities modal', async () => {
      await this.allCityButton.click();

      await expect(this.allCityModal).toBeVisible();
      await expect(this.cityCardInModal).toBeVisible();
    });
  }

  async assertThatCityListIsVisible() {
    await allure.step('Assert that city list is visible', async () => {
      await expect(this.cityList).toBeVisible();
      await expect(this.cityCard).toBeVisible();
    });
  }

  async assertThatCityListIsNotVisible() {
    await allure.step('Assert that city list is not visible', async () => {
      await expect(this.cityList).not.toBeVisible();
    });
  }
}
