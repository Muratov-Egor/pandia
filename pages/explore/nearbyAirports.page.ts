import {expect, Page} from "@playwright/test";
import {allure} from "allure-playwright";

export class NearbyAirportsPage {
  constructor(private readonly page: Page) {
  }

  readonly nearbyAirportsWidget = this.page.getByTestId('nearby-airports');
  readonly firstNearbyAirport = this.page.getByTestId('nearby-airport-card').first();
  readonly firstNearbyAirportName = this.firstNearbyAirport.getByTestId('nearby-airport-title');

  async assertThatNearbyWidgetIsVisible() {
    await allure.step('Виджет "Ближайшие аэропорты" отображается', async () => {
      await expect(this.nearbyAirportsWidget).toBeVisible();
    });
  }

  async getFirstNearbyAirportName() {
    return await allure.step('Получить имя первого ближайшего аэропорта', async () => {
      return await this.firstNearbyAirportName.textContent().then(name => name.split(',')[0].trim());
    });
  }

  async goToFirstNearbyAirport() {
    await allure.step('Перейти на страницу первого ближайшего аэропорта', async () => {
      await this.firstNearbyAirport.click();
    });
  }
}
