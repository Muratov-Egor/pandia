import {test} from '@playwright/test';

import {CitiesWidgetPage} from '../pages/explore/citiesWidget.page';
import {SearchFormPage} from "../pages/explore/searchForm.page";

import {MOSCOW_NP_FLIGHT} from "../constants/explore/DirectionUrl";
import {IataCityCode} from "../enums/IataCityCode";

import {allureTestInfo} from "../utils/AllureHelper";
import {BaseSteps} from "../pages/baseSteps.page";

test.describe('Экрана Страны. Виджет "Городов"', () => {
  test.beforeEach(async ({page}) => {
    const baseStep = new BaseSteps(page)
    const searchFormPage = new SearchFormPage(page);

    await baseStep.openPage(MOSCOW_NP_FLIGHT);
    await searchFormPage.waitForSearchFormToLoad(true)
  });

  test('Скрыть виджет "Городов" после выбора  первого города', async ({page}) => {
    await allureTestInfo({id: "8418", owner: "Egor Muratov", team: "Explore"});

    const citiesWidgetPage = new CitiesWidgetPage(page);
    const searchFormPage = new SearchFormPage(page);

    await citiesWidgetPage.assertThatCityListIsVisible();
    const cityName = await citiesWidgetPage.getCityName();
    await citiesWidgetPage.selectCity();

    await citiesWidgetPage.assertThatCityListIsNotVisible();
    await searchFormPage.assertThatDestinationIsEqualToExpected(cityName);
  });

  test('Скрыть виджет "Городов" после выбора перового города в модалке "Все города"', async ({page}) => {
    await allureTestInfo({id: "8416", owner: "Egor Muratov", team: "Explore"});

    const citiesWidgetPage = new CitiesWidgetPage(page);
    const searchFormPage = new SearchFormPage(page);

    await citiesWidgetPage.openAllCitiesModal();
    const cityName = await citiesWidgetPage.getCityName(true);
    await citiesWidgetPage.selectCity(true);

    await citiesWidgetPage.assertThatCityListIsNotVisible();
    await searchFormPage.assertThatDestinationIsEqualToExpected(cityName);
  });

  test('Скрыть виджет "Городов"  после указания города в поле "Куда"', async ({page}) => {
    await allureTestInfo({id: "8417", owner: "Egor Muratov", team: "Explore"});

    const citiesWidgetPage = new CitiesWidgetPage(page);
    const searchFormPage = new SearchFormPage(page);

    await citiesWidgetPage.assertThatCityListIsVisible();
    await searchFormPage.fillInDestination({cityIata: IataCityCode.LED});

    await searchFormPage.waitForSearchFormToLoad(true)
    await citiesWidgetPage.assertThatCityListIsNotVisible();
  });
});
