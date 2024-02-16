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
  readonly passengersField: Locator;
  readonly passengerNumbers: Locator;
  readonly tripClass: Locator;

  private readonly suggestedCity: string = 'xpath=//*[@data-test-id="suggested-city-*#*"]';
  private readonly suggestedAirport: string = 'xpath=//*[@data-test-id="suggested-airport-*#*"]';
  private readonly suggestedCountry: string = 'xpath=//*[@data-test-id="suggested-country-*#*"]';
  private readonly numberOfPassengerBlock: string = 'xpath=//*[@data-test-id="number-of-*#*"]'
  private readonly increaseButton: string = `${this.numberOfPassengerBlock}//*[@data-test-id="increase-button"]`;
  private readonly tripClassInput: string = 'xpath=//*[@data-test-id="trip-class-*#*"]/parent::label'

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
    this.passengersField = page.getByTestId('passengers-field');
    this.passengerNumbers = page.getByTestId('passenger-numbers');
    this.tripClass = page.getByTestId('trip-class');

  }

  async openCalendar() {
    await allure.step('Открыть календарь', async () => {
      await this.startDateInput.click();
    });
  }

  async fillInOrigin(param: { cityIata?: string, airportIata?: string }) {
    const {cityIata, airportIata} = param;

    if (cityIata) {
      await this.fillInFieldAndSelect(this.originInput, cityIata, this.suggestedCity);
    }

    if (airportIata) {
      await this.fillInFieldAndSelect(this.originInput, airportIata, this.suggestedAirport);
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
      await this.fillInFieldAndSelect(this.destinationInput, cityIata, this.suggestedCity);
    }

    if (airportIata) {
      await this.fillInFieldAndSelect(this.destinationInput, airportIata, this.suggestedAirport);
    }

    if (countryCode) {
      await this.fillInFieldAndSelect(this.destinationInput, countryCode, this.suggestedCountry);
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

  async selectNumberOfPassengerAndTripClass(param: {
    children: number;
    adults: number;
    infant: number,
    tripClass: string
  }) {
    const {adults, children, infant, tripClass} = param;
    await allure.step(`Выбрать количество пассажиров: взрослых - ${adults}, детей - ${children}, младенцев - ${infant}, класс - ${tripClass}`, async () => {
      await this.passengersField.click();

      if (adults) {
        await this.addPassenger('adults', adults - 1);
      }

      if (children) {
        await this.addPassenger('children', children);
      }

      if (infant) {
        await this.addPassenger('infants', infant);
      }

      if (tripClass) {
        const tripClassLocator = this.tripClassInput.replace('*#*', tripClass);
        await this.page.locator(tripClassLocator).click();
      }

      await this.passengersField.click();
    });
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

  async assertThatNumberOfPassengersIsEqualToExpected(number: number) {
    await allure.step(`Количество пассажиров равно: ${number}`, async () => {
      const passengerNumbers = parseInt(await this.passengerNumbers.textContent());
      expect(passengerNumbers).toEqual(number);
    });
  }

  async assertThatTripClassIsEqualToExpected(expectedTripClass: string) {
    await allure.step(`Класс перелета равен: ${expectedTripClass}`, async () => {
      const tripClass = await this.tripClass.textContent();
      expect(tripClass).toEqual(expectedTripClass);
    });
  }

  private async fillInFieldAndSelect(inputLocator: Locator, inputValue: string, prefix: string) {
    const field = inputLocator === this.originInput ? 'Откуда' : 'Куда';

    await allure.step(`Ввести в поле ${field} значение: ${inputValue}`, async () => {
      await inputLocator.fill(inputValue);
      const suggested = prefix.replace('*#*', inputValue);
      await this.page.locator(suggested).click();

    });
  }

  private async addPassenger(passengerType: string, count: number) {
    await allure.step(`Добавить ${count} пассажиров типа ${passengerType}`, async () => {
      for (let i = 0; i < count; i++) {
        const increasePassengerTypeButton = this.increaseButton.replace('*#*', passengerType)
        await this.page.locator(increasePassengerTypeButton).click();
      }
    });
  }
}
