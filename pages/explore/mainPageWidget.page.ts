import {Page} from "@playwright/test";
import {allure} from "allure-playwright";

export class MainPageWidgetPage {
  readonly weekendsBlock = this.page.getByTestId('weekends-block');
  readonly weekendsSelectCityButton = this.weekendsBlock.getByTestId('select-city-button');

  constructor(private readonly page: Page) {
  }

  async goToWeekendsService() {
    await allure.step('Клик по кнопке "Выбрать город" в блоке "На выходные"', async () => {
      await this.weekendsSelectCityButton.click();
    });
  }
}

