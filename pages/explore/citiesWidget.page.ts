import {expect, Locator, Page} from '@playwright/test';
import {allure} from "allure-playwright";

export class CitiesWidgetPage {
  constructor(private readonly page: Page) {}

  readonly cityList = this.page.getByTestId('city-list');
  readonly cityCard = this.page.getByTestId('city-card').first();
  readonly cityName = this.cityCard.getByTestId('city-name');
  readonly allCityButton = this.page.getByTestId('all-city-button');
  readonly allCityModal = this.page.getByTestId('all-cities-modal');
  readonly cityCardInModal = this.allCityModal.getByTestId('city-card').first();
  readonly cityNameInModal = this.cityCardInModal.getByTestId('city-name');

  async selectCity(isModal = false) {
    await allure.step('Выбрать первый город из списка', async () => {
      const cityCard = isModal ? this.cityCardInModal : this.cityCard;
      await cityCard.click();
    });
  }

  async getCityName(isModal = false) {
    return allure.step('Получить название первого города ', async () => {
      return isModal ? await this.cityNameInModal.textContent() : await this.cityName.textContent();
    });
  }

  async openAllCitiesModal() {
    await allure.step('Открыть модальное окно "Все города страны"', async () => {
      await this.allCityButton.click();

      await expect(this.allCityModal).toBeVisible();
      await expect(this.cityCardInModal).toBeVisible();
    });
  }

  async assertThatCityListIsVisible() {
    await allure.step('Виджет "Городов" отображается', async () => {
      await expect(this.cityList).toBeVisible();
      await expect(this.cityCard).toBeVisible();
    });
  }

  async assertThatCityListIsNotVisible() {
    await allure.step('Виджет "Городов" не отображается', async () => {
      await expect(this.cityList).not.toBeVisible();
    });
  }
}
