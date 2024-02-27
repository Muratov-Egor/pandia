import {expect, Page} from "@playwright/test";
import {allure} from "allure-playwright";
import {dateInSearchForm} from "../../utils/DateFormarter";

export class SearchFormPage {
  constructor(private readonly page: Page) {}

  readonly searchForm = this.page.getByTestId('avia-form');
  readonly originInput = this.page.getByTestId('origin-input');
  readonly destinationInput = this.page.getByTestId('destination-input');
  readonly formSubmitButton = this.page.getByTestId('form-submit');
  readonly suggestedAnywhere = this.page.getByTestId('suggested-anywhere');
  readonly suggestedWeekend = this.page.getByTestId('suggested-weekend');
  readonly startDateInput = this.page.getByTestId('start-date-field');
  readonly startDateValue = this.page.getByTestId('start-date-value');
  readonly endDateValue = this.page.getByTestId('end-date-value');
  readonly hotelCheckbox = this.page.getByTestId('checkbox');
  readonly passengersField = this.page.getByTestId('passengers-field');
  readonly passengerNumbers = this.page.getByTestId('passenger-numbers');
  readonly tripClass = this.page.getByTestId('trip-class');
  readonly multiwaySearchFormButton = this.page.getByTestId('switch-to-multiwayform');

  readonly originIata = this.page.locator(`xpath=//*[@data-test-id="origin-input"]/following-sibling::*[@data-test-id="iata"]`)
  readonly destinationIata = this.page.locator(`xpath=//*[@data-test-id="destination-input"]/following-sibling::*[@data-test-id="iata"]`)
  readonly suggestedCity = (city: string) => this.page.getByTestId(`suggested-city-${city}`);
  readonly suggestedAirport = (airport: string) => this.page.getByTestId(`suggested-airport-${airport}`);
  readonly suggestedCountry = (country: string) => this.page.getByTestId(`suggested-country-${country}`);
  readonly numberOfPassengerBlock = (passengerType: string) => this.page.getByTestId(`number-of-${passengerType}`);
  readonly increaseButton = (passengerType: string) => this.numberOfPassengerBlock(passengerType).getByTestId('increase-button');
  readonly tripClassInput = (tripClass: string) => this.page.locator(`xpath=//*[@data-test-id="trip-class-${tripClass}"]/parent::label`)

  async openCalendar() {
    await allure.step('Открыть календарь', async () => {
      await this.startDateInput.click();
    });
  }

  async fillInOrigin(param: { cityIata?: string, airportIata?: string }) {
    const {cityIata, airportIata} = param;

    if (cityIata) {
      await allure.step(`Ввести в поле "Откуда" значение: ${cityIata}`, async () => {
        await this.originInput.fill(cityIata);
        await this.suggestedCity(cityIata).click();
      });
    }

    if (airportIata) {
      await allure.step(`Ввести в поле "Откуда" значение: ${airportIata}`, async () => {
        await this.originInput.fill(airportIata);
        await this.suggestedAirport(airportIata).click();
      });
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
      await allure.step(`Ввести в поле "Куда" значение: ${cityIata}`, async () => {
        await this.destinationInput.fill(cityIata);
        await this.suggestedCity(cityIata).click();
      });
    }

    if (airportIata) {
      await allure.step(`Ввести в поле "Куда" значение: ${airportIata}`, async () => {
        await this.destinationInput.fill(airportIata);
        await this.suggestedAirport(airportIata).click();
      });
    }

    if (countryCode) {
      await allure.step(`Ввести в поле "Куда" значение: ${countryCode}`, async () => {
        await this.destinationInput.fill(countryCode);
        await this.suggestedCountry(countryCode).click();
      });
    }

    if (isAnywhere) {
      await allure.step('Ввести в поле "Куда" значение: "Куда угодно"', async () => {
        await this.destinationInput.fill('anywhere');
        await this.suggestedAnywhere.click();
      });
    }

    if (isWeekend) {
      await allure.step('Ввести в поле "Куда" значение: "Выходные"', async () => {
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
        await this.tripClassInput(tripClass).click();
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
      await expect(this.originIata).toHaveText(origin);
      await expect(this.destinationIata).toHaveText(destination);
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

  private async addPassenger(passengerType: string, count: number) {
    await allure.step(`Добавить ${count} пассажиров типа ${passengerType}`, async () => {
      for (let i = 0; i < count; i++) {
        await this.increaseButton(passengerType).click();
      }
    });
  }

  async switchToMultiwaySearchForm() {
    await allure.step('Переключиться на форму сложного поиска', async () => {
      await this.multiwaySearchFormButton.click();
    });
  }
}
