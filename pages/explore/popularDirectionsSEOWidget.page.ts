import {expect, Page} from "@playwright/test";
import {allure} from "allure-playwright";

export class PopularDirectionsSEOWidgetPage {
  constructor(private readonly page: Page) {}

  readonly firstCityNameBlock = this.page.getByTestId('destination-city').first()
  readonly cityBlocks = this.page.getByTestId('destination-city')
  readonly destinationOpener = this.page.getByTestId('destination-header-opener').first()
  readonly firstRouteLinkBlock = this.page.getByTestId('destination-route').first()
  readonly routeLinkBlocks = this.page.getByTestId('destination-route')
  readonly firstRoute = this.page.getByTestId('destination-route-name').first()

  async getFirstCityName() {
    return await allure.step('Получить название первого города', async () => {
      return await this.firstCityNameBlock.textContent()
    });
  }

  async getUrlOfFirstCityName() {
    return await allure.step('Получить ссылку первого города', async () => {
      return await this.firstCityNameBlock.getAttribute('href')
    });
  }

  async getFirstRoute() {
    return await allure.step('Получить origin и destination первого маршрута', async () => {
      const route = await this.firstRoute.textContent()
      const [origin, destination] = route.split(' - ').map(str => str.trim())
      return {origin, destination}
    });
  }

  async getUrlOfFirstRoute() {
    return await allure.step('Получить ссылку первого маршрута', async () => {
      return await this.firstRouteLinkBlock.getAttribute('href')
    });
  }

  async openFirstCityPage() {
    return await allure.step('Открыть страницу первого города', async () => {
      await this.firstCityNameBlock.click()
    });
  }

  async openFirstRoutePage() {
    return await allure.step('Открыть страницу первого маршрута', async () => {
      await this.destinationOpener.click()
      await this.firstRouteLinkBlock.click()
    });
  }

  async assertThatBlockIsHidden() {
    return await allure.step('Проверить, что блок скрыт', async () => {
      for (const city of await this.cityBlocks.all()) {
        await expect(city).toBeHidden()
        await expect(city).toHaveAttribute('href')
      }
    });
  }

  async assertThatCityNameBlocksHaveHrefLink() {
    return await allure.step('Проверить, что блоки с названиями городов содержат ссылки', async () => {
      for (const city of await this.cityBlocks.all()) {
        await expect(city).toBeVisible()
        await expect(city).toHaveAttribute('href')
      }
    });
  }

  async assertThatRouteLinkHaveHrefUrl() {
    return await allure.step('Проверить, что блоки с маршрутами содержат ссылки', async () => {
      for (const link of await this.routeLinkBlocks.all()) {
            await expect(link).toHaveAttribute('href')
      }
    });
  }
}
