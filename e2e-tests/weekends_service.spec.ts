import {test} from "@playwright/test";
import {allureTestInfo} from "../utils/AllureHelper";

import {BaseSteps} from "../pages/baseSteps.page";
import {SearchFormPage} from "../pages/explore/searchForm.page";
import {CalendarPage} from "../pages/explore/calendar.page";
import {WeekendsServicePage} from "../pages/explore/weekendsService.page";

import {ORIGIN_IS_MOSCOW, WEEKENDS_SERVICE} from "../constants/explore/DirectionUrl";
import {WeekendsPricesWidget} from "../pages/explore/weekendsPricesWidget.page";
import {MainPageWidgetPage} from "../pages/explore/mainPageWidget.page";

test.describe.skip('Сервис выходных', () => {
  test('Открытие сервисы "На выходные" по прямой ссылке', async ({page}) => {
    await allureTestInfo({owner: "Egor Muratov", team: "Explore", feature: "На выходные"});

    const baseStep = new BaseSteps(page)
    const searchForm = new SearchFormPage(page);
    const calendar = new CalendarPage(page);
    const weekendsService = new WeekendsServicePage(page);

    await baseStep.openPage(WEEKENDS_SERVICE)
    await searchForm.waitForSearchFormToLoad(true)

    await searchForm.openCalendar()
    await calendar.selectAllWeekends()
    await weekendsService.assertThatWeekendsCityListIsVisible()
  })

  test('Переход на страницу города из сервиса "На выходные"', async ({page}) => {
    await allureTestInfo({owner: "Egor Muratov", team: "Explore", feature: "На выходные"});

    const baseStep = new BaseSteps(page)
    const searchForm = new SearchFormPage(page);
    const weekendsService = new WeekendsServicePage(page);
    const weekendsWidget = new WeekendsPricesWidget(page);

    await baseStep.openPage(ORIGIN_IS_MOSCOW)
    await searchForm.waitForSearchFormToLoad()

    await searchForm.fillInDestination({isWeekend: true})
    const firstCityName = await weekendsService.getFirstCityName()
    await weekendsService.selectFirstCity()
    // @ts-ignore
    await searchForm.assertThatDestinationIsEqualToExpected(firstCityName)
    await weekendsService.assertThatWeekendsCityListIsNotVisible()
    await weekendsWidget.assertThatWidgetIsVisible()

  });

  test('Переход в сервис "На выходные" с блока "На Выходные" на главном экране"', async ({page}) => {
    await allureTestInfo({owner: "Egor Muratov", team: "Explore", feature: "На выходные"});

    const baseStep = new BaseSteps(page)
    const mainPageWidget = new MainPageWidgetPage(page);
    const weekendsService = new WeekendsServicePage(page);

    await baseStep.openPage(ORIGIN_IS_MOSCOW)

    await mainPageWidget.goToWeekendsService()
    await weekendsService.assertThatWeekendsCityListIsVisible()
  })
});
