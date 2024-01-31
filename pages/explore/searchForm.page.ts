import {expect, Locator, Page} from "@playwright/test";

export class SearchFormPage {
  readonly page: Page;
  readonly searchForm: Locator;
  readonly destinationInput: Locator;
  readonly originInput: Locator;
  readonly formSubmitButton: Locator;
  readonly suggestedAnywhere: Locator;
  readonly suggestedWeekend: Locator;

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
  }

  async fillInFieldAndSelect(inputLocator: Locator, inputValue: string, prefix: string) {
    await inputLocator.fill(inputValue);
    await this.page.getByTestId(`${prefix}${inputValue}`).click();
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
      await this.destinationInput.fill('anywhere');
      await this.suggestedAnywhere.click();
    }

    if (isWeekend) {
      await this.destinationInput.fill('weekend');
      await this.suggestedWeekend.click();
    }
  }

  async waitForSearchFormToLoad(isDestination: boolean = false) {
    await expect(this.searchForm).toBeVisible();
    await expect(this.formSubmitButton).toBeEnabled();
    await expect(this.originInput).toHaveAttribute('value');

    if (isDestination) {
      await expect(this.destinationInput).toHaveAttribute('value');
    }
  }

  async assertThatDestinationIsEqualToExpected(expectedDestination: string) {
    const destinationInputValue = await this.destinationInput.getAttribute('value');
    expect(destinationInputValue).toEqual(expectedDestination);
  }
}
