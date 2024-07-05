import {expect, Page} from "@playwright/test";
import {allure} from "allure-playwright";

export class PriceMapPage {
  readonly countryList = this.page.getByTestId('countries-list')
  readonly mapContainer = this.page.getByTestId('price-map-container')
  readonly countryItem = this.page.getByTestId('country-item').first()
  readonly countryName = this.countryItem.getByTestId('country-name')
  readonly currentCountry = this.page.getByTestId('country-name')
  readonly citiesList = this.page.getByTestId('cities-list')
  readonly cityItem = this.citiesList.getByTestId('city-item').first()
  readonly cityName = this.cityItem.getByTestId('city-name')

  constructor(private readonly page: Page) {
  }

  async chooseFirstCountry() {
    await allure.step('Клик по первой стране в списке', async () => {
      await this.countryItem.click()
    });
  }

  async chooseFirstCity() {
    await allure.step('Клик по первому городу в списке', async () => {
      await this.cityItem.click()
    });
  }

  async getFirstCityName() {
    // @ts-ignore
    return await allure.step('Получение имени первого города в списке', async () => {
      return await this.cityName.textContent()
    });
  }

  async getFirstCountryName() {
    // @ts-ignore
    return await allure.step('Получение имени первой страны в списке', async () => {
      return await this.countryName.textContent()
    });
  }

  async assertThatMapIsLoaded() {
    await allure.step('Проверка отображения карты', async () => {
      await this.countryList.waitFor({state: 'visible'})
      await this.mapContainer.waitFor({state: 'visible'})
      await this.countryItem.waitFor({state: 'visible'})
    });
  }

  async assertThatShowsListCitiesOfTheSelectedCountry() {
    await allure.step('Проверка отображения списка городов выбранной страны', async () => {
      await this.citiesList.waitFor({state: 'visible'})
      await this.cityItem.waitFor({state: 'visible'})
    });
  }

  async assertThatCountryNameIsEqualToExpected(countryName: string) {
    await allure.step(`Проверка, что название страны равно ${countryName}`, async () => {
      const currentCountry = await this.currentCountry.textContent()
      expect(currentCountry).toBe(countryName)
    });
  }

  async assertThatPriceMapContainerIsHidden() {
    await allure.step('Проверка, что контейнер карты скрыт', async () => {
      await this.mapContainer.waitFor({state: 'hidden'})
    });
  }

  async blockMapTiler() {
    await allure.step('Блокировка запросов к MapTiler', async () => {
      await this.page.route('https://api.maptiler.com/**', route => {
        route.abort();
      });
    });
  }
}



