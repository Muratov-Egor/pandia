import {Page} from "@playwright/test";
import {allure} from "allure-playwright";

export class MainPageWidgetPage {
  constructor(private readonly page: Page) {
  }

  readonly weekendsBlock = this.page.getByTestId('weekends-block');
  readonly weekendsSelectCityButton = this.weekendsBlock.getByTestId('select-city-button');
  readonly hotTicketsBlock = this.page.getByTestId('hot-tickets');
  readonly hotTicketLink = this.hotTicketsBlock.getByTestId('hot-ticket').first();
  readonly popularDestinationBlock = this.page.getByTestId('popular-destinations');
  readonly firstPoiInPopular = this.popularDestinationBlock.getByTestId('poi-item').first();
  readonly countryName = this.firstPoiInPopular.getByTestId('poi-item-name');
  readonly priceMapBlock = this.page.getByTestId('price-map-banner');
  readonly promoKorocheBlock = this.page.getByTestId('promo-koroche-button');
  readonly promoKorocheCityName = this.page.getByTestId('promo-koroche-city-name');
  readonly blogBlock = this.page.getByTestId('blog-block');
  readonly locationsCompilation = this.page.getByTestId('locations-compilation');
  readonly firstLocation = this.locationsCompilation.getByTestId('collection-item').first();
  readonly firstLocationName = this.firstLocation.getByTestId('location-name');

  async goToWeekendsService() {
    await allure.step('Клик по кнопке "Выбрать город" в блоке "На выходные"', async () => {
      await this.weekendsSelectCityButton.click();
    });
  }

  async goToPriceMap() {
    await allure.step('Клик по блоку "Карта цен"', async () => {
      await this.priceMapBlock.click();
    });
  }

  async getFirstPopularCountryName() {
    return await allure.step('Получение имени первой страны в блоке "Популярные направления"', async () => {
      return await this.countryName.textContent();
    });
  }

  async goToFirstPopularCountry() {
    await allure.step('Клик по первой стране в блоке "Популярные направления"', async () => {
      await this.firstPoiInPopular.click();
    });
  }

  async getPromoKorocheCityName() {
    return await allure.step('Получение имени города в блоке "Промо Короче"', async () => {
      return await this.promoKorocheCityName.textContent();
    });
  }

  async goToCityPromoKoroche() {
    await allure.step('Клик по блоку "Промо Короче"', async () => {
      await this.promoKorocheBlock.click();
    });
  }

  async chooseHotTicket() {
    await allure.step('Клик по билету в блоке "Горящие билеты"', async () => {
      await this.hotTicketLink.click();
    });
  }

  async goToBlog() {
    await allure.step('Клик по блоку "Блог"', async () => {
      await this.blogBlock.click();
    });
  }

  async getBlogURL() {
    return await allure.step('Получение URL блока "Блог"', async () => {
      return await this.blogBlock.getAttribute('href');
    });
  }

  async chooseFirstLocation() {
    await allure.step('Клик по первому ПОИ в блоке "Подборки"', async () => {
      await this.firstLocation.click();
    });
  }

  async getFirstLocationName() {
    return await allure.step('Получение имени первого ПОИ в блоке "Подборки"', async () => {
      return await this.firstLocationName.textContent();
    });
  }
}
