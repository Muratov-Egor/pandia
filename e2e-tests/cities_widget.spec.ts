import {test} from '@playwright/test';

import {CitiesWidgetPage} from '../pages/explore/citiesWidget.page';
import {SearchFormPage} from "../pages/explore/searchForm.page";

import {MOSCOW_NP_FLIGHT} from "../constants/explore/DirectionUrl";
import {IataCityCode} from "../enums/IataCityCode";

import {allureTestInfo} from "../utils/AllureHelper";

test('Hide "Cities" widget after choosing a city card', async ({page}) => {
  await allureTestInfo({id: "8418", owner: "Egor Muratov", team: "Explore"});

  const citiesWidgetPage = new CitiesWidgetPage(page);
  const searchFormPage = new SearchFormPage(page);
  await page.goto(MOSCOW_NP_FLIGHT);
  await searchFormPage.waitForSearchFormToLoad(true)

  await citiesWidgetPage.assertThatCityListIsVisible();
  const cityName = await citiesWidgetPage.getCityName();
  await citiesWidgetPage.selectCity();

  await citiesWidgetPage.assertThatCityListIsNotVisible();
  await searchFormPage.assertThatDestinationIsEqualToExpected(cityName);
});

test('Hide "Cities" widget after choosing a city card from "All cities" modal', async ({page}) => {
  await allureTestInfo({id: "8416", owner: "Egor Muratov", team: "Explore"});

  const citiesWidgetPage = new CitiesWidgetPage(page);
  const searchFormPage = new SearchFormPage(page);
  await page.goto(MOSCOW_NP_FLIGHT);
  await searchFormPage.waitForSearchFormToLoad(true)

  await citiesWidgetPage.openAllCitiesModal();
  const cityName = await citiesWidgetPage.getCityName(true);
  await citiesWidgetPage.selectCity(true);

  await citiesWidgetPage.assertThatCityListIsNotVisible();
  await searchFormPage.assertThatDestinationIsEqualToExpected(cityName);
});

test('Hide "Cities" widget after typing a city as destination', async ({page}) => {
  await allureTestInfo({id: "8417", owner: "Egor Muratov", team: "Explore"});

  const citiesWidgetPage = new CitiesWidgetPage(page);
  const searchFormPage = new SearchFormPage(page);
  await page.goto(MOSCOW_NP_FLIGHT);
  await searchFormPage.waitForSearchFormToLoad(true)

  await citiesWidgetPage.assertThatCityListIsVisible();
  await searchFormPage.fillInDestination({cityIata: IataCityCode.LED});

  await searchFormPage.waitForSearchFormToLoad(true)
  await citiesWidgetPage.assertThatCityListIsNotVisible();
});
