import {expect, Page} from "@playwright/test";
import {allure} from "allure-playwright";

export class WeekendsServicePage {
  readonly weekendsCityList = this.page.getByTestId('weekends-city-list');
  readonly firstCityCard = this.page.getByTestId('city-card').first();
  readonly firstCityName = this.firstCityCard.getByTestId('city-name');
  readonly placeholder = this.page.getByTestId('weekends-service-placeholder');

  constructor(private readonly page: Page) {
  }

  async getFirstCityName() {
    return await allure.step('Получить название первого города ', async () => {
      return await this.firstCityName.textContent();
    });
  }

  async selectFirstCity() {
    await allure.step('Выбрать первый город из списка', async () => {
      await this.firstCityCard.click();
    });
  }

  async assertThatWeekendsCityListIsVisible() {
    await allure.step('Отображается сервис "На выходные"', async () => {
      await expect(this.weekendsCityList).toBeVisible();
      await expect(this.firstCityCard).toBeVisible();
      await expect(this.placeholder).not.toBeVisible();
    });
  }

  async assertThatWeekendsCityListIsNotVisible() {
    await allure.step('Сервис "На выходные" не отображается', async () => {
      await expect(this.weekendsCityList).not.toBeVisible();
    });
  }


}


