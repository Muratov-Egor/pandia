import {expect, Locator, Page} from "@playwright/test";
import {allure} from "allure-playwright";
import {dateInSearchForm} from "../../utils/DateFormarter";

export class SearchFormPage {
  readonly page: Page;
  readonly searchForm: Locator;
  readonly destinationInput: Locator;
  readonly originInput: Locator;
  readonly formSubmitButton: Locator;
  readonly suggestedAnywhere: Locator;
  readonly suggestedWeekend: Locator;
  readonly startDateInput: Locator;
  readonly startDateValue: Locator;
  readonly endDateValue: Locator;
  readonly hotelCheckbox: Locator;
  readonly passengerNumbers: Locator;

  private readonly suggestedCityPrefix: string = 'suggested-city-';
  private readonly suggestedAirportPrefix: string = 'suggested-airport-';
  private readonly suggestedCountryPrefix: string = 'suggested-country-';

  constructor(page: Page) {
    this.page = page;
    this.searchForm = page.getByTestId('avia-form');
    this.originInput = page.getByTestId('origin-input');
    this.destinationInput = page.getByTestId('destination-input');
    this.formSubmitButton = page.getByTestId('form-submit');
    this.suggestedAnywhere = page.getByTestId('suggested-anywhere');
    this.suggestedWeekend = page.getByTestId('suggested-weekend');
    this.startDateInput = page.getByTestId('start-date-field');
    this.startDateValue = page.getByTestId('start-date-value');
    this.endDateValue = page.getByTestId('end-date-value');
    this.hotelCheckbox = page.getByTestId('checkbox');
    this.passengerNumbers = page.getByTestId('passenger-numbers');
  }

  async openCalendar() {
    await allure.step('Открыть календарь', async () => {
      await this.startDateInput.click();
    });
  }

  private async fillInFieldAndSelect(inputLocator: Locator, inputValue: string, prefix: string) {
    const field = inputLocator === this.originInput ? 'Откуда' : 'Куда';

    await allure.step(`Ввести в поле ${field} значение: ${inputValue}`, async () => {
      await inputLocator.fill(inputValue);
      await this.page.getByTestId(`${prefix}${inputValue}`).click();
    });
  }

  async fillInOrigin(param: { cityIata?: string, airportIata?: string }) {
    const {cityIata, airportIata} = param;

    if (cityIata) {
      await this.fillInFieldAndSelect(this.originInput, cityIata, this.suggestedCityPrefix);
    }

    if (airportIata) {
      await this.fillInFieldAndSelect(this.originInput, airportIata, this.suggestedAirportPrefix);
    }
  }

  async fillInDestination(param: {
    cityIata?: string,
    airportIata?: string,
    countryCode?: string,
    isAnywhere?: boolean,
    isWeekend?: boolean
  }) {

    const {cityIata, airportIata, countryCode, isAnywhere, isWeekend} = param;
    if (cityIata) {
      await this.fillInFieldAndSelect(this.destinationInput, cityIata, this.suggestedCityPrefix);
    }

    if (airportIata) {
      await this.fillInFieldAndSelect(this.destinationInput, airportIata, this.suggestedAirportPrefix);
    }

    if (countryCode) {
      await this.fillInFieldAndSelect(this.destinationInput, countryCode, this.suggestedCountryPrefix);
    }

    if (isAnywhere) {
      await allure.step(`Выбрать "Куда угодно"`, async () => {
        await this.destinationInput.fill('anywhere');
        await this.suggestedAnywhere.click();
      });
    }

    if (isWeekend) {
      await allure.step(`Выбрать "Улететь на выходные"`, async () => {
        await this.destinationInput.fill('weekend');
        await this.suggestedWeekend.click();
      });
    }
  }

  async waitForSearchFormToLoad(isDestination: boolean = false) {
    await allure.step('Дождаться когда форма полностью загрузится', async () => {
      await expect(this.searchForm).toBeVisible();
      await expect(this.formSubmitButton).toBeEnabled();
      await expect(this.originInput).toHaveAttribute('value');

      if (isDestination) {
        await expect(this.destinationInput).toHaveAttribute('value');
      }
    });
  }

  async assertThatDestinationIsEqualToExpected(expectedDestination: string) {
    await allure.step(`В поле "Куда" указано: ${expectedDestination}`, async () => {
      const destinationInputValue = await this.destinationInput.getAttribute('value');
      expect(destinationInputValue).toEqual(expectedDestination);
    });
  }

  async uncheckHotelCheckbox() {
    await allure.step('Снять отельный чекбокс', async () => {
      await this.hotelCheckbox.click();
    });
  }

  async startSearch() {
    await allure.step('Запустить поиск', async () => {
      await this.formSubmitButton.click();
    });
  }

  async assertThatDirectionIsEqualToExpected(origin: string, destination: string) {
    await allure.step(`В поле "Откуда" указано: ${origin}, а в поле "Куда" указано: ${destination}`, async () => {
      await expect(this.originInput).toHaveValue(origin);
      await expect(this.destinationInput).toHaveValue(destination);
    });
  }

  async assertThatStartDateIsEqualToExpected(date: Date) {
    const startDate = dateInSearchForm(date)
    await allure.step(`Дата "Туда" равна: ${startDate}`, async () => {
      const startDateValue = await this.startDateValue.textContent();
      expect(startDateValue).toContain(startDate);
    });
  }

  async assertThatEndDateIsEqualToExpected(date: Date) {
    const endDate = dateInSearchForm(date)
    await allure.step(`Дата "Обратно" равна: ${endDate}`, async () => {
      const endDateValue = await this.endDateValue.textContent();
      expect(endDateValue).toContain(endDate);
    });
  }
}
