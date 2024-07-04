import {test} from "@playwright/test";
import {allureTestInfo} from "../utils/AllureHelper";

import {BaseSteps} from "../pages/baseSteps.page";
import {SearchFormPage} from "../pages/explore/searchForm.page";
import {CalendarPage} from "../pages/explore/calendar.page";
import {WeekendsServicePage} from "../pages/explore/weekendsService.page";

import {ORIGIN_IS_MOSCOW, WEEKENDS_SERVICE} from "../constants/explore/DirectionUrl";
import {FLEXIBLE_CALENDAR_CONFIG} from "../constants/Flags";
import {WeekendsPricesWidget} from "../pages/explore/weekendsPricesWidget.page";
import {MainPageWidgetPage} from "../pages/explore/mainPageWidget.page";

const optionsFlexConfig = {
  variantKey: "onlyWeekends",
  variantAttachment: {
    config: {"flexibleDates": false, "onlyPopularDestinations": false, "tripPeriod": false, "weekends": true},
    enabled: true
  }
}

test.describe('Сервис выходных', () => {
  test('Открытие сервисы "На выходные" по прямой ссылке', async ({page}) => {
    await allureTestInfo({owner: "Egor Muratov", team: "Explore"});

    const baseStep = new BaseSteps(page)
    const searchForm = new SearchFormPage(page);
    const calendar = new CalendarPage(page);
    const weekendsService = new WeekendsServicePage(page);

    const flexConfig = await baseStep.overrideFrontEndFlagr({
      flagName: FLEXIBLE_CALENDAR_CONFIG,
      flagOptions: optionsFlexConfig,
      isFirstQueryParam: false
    })

    await baseStep.openPage(WEEKENDS_SERVICE + flexConfig)
    await searchForm.waitForSearchFormToLoad(true)

    await searchForm.openCalendar()
    await calendar.selectAllWeekends()
    await weekendsService.assertThatWeekendsCityListIsVisible()
  })

  test('Переход на страницу города из сервиса "На выходные"', async ({page}) => {
    await allureTestInfo({owner: "Egor Muratov", team: "Explore"});

    const baseStep = new BaseSteps(page)
    const searchForm = new SearchFormPage(page);
    const weekendsService = new WeekendsServicePage(page);
    const weekendsWidget = new WeekendsPricesWidget(page);

    const flexConfig = await baseStep.overrideFrontEndFlagr({
      flagName: FLEXIBLE_CALENDAR_CONFIG,
      flagOptions: optionsFlexConfig,
      isFirstQueryParam: false
    })

    await baseStep.openPage(ORIGIN_IS_MOSCOW + flexConfig)
    await searchForm.waitForSearchFormToLoad()

    await searchForm.fillInDestination({isWeekend: true})
    const firstCityName = await weekendsService.getFirstCityName()
    await weekendsService.selectFirstCity()

    await searchForm.assertThatDestinationIsEqualToExpected(firstCityName)
    await weekendsService.assertThatWeekendsCityListIsNotVisible()
    await weekendsWidget.assertThatWidgetIsVisible()

  });

  test('Переход в сервис "На выходные" с блока "На Выходные" на главном экране"', async ({page}) => {
    await allureTestInfo({owner: "Egor Muratov", team: "Explore"});

    const baseStep = new BaseSteps(page)
    const mainPageWidget = new MainPageWidgetPage(page);
    const weekendsService = new WeekendsServicePage(page);

    const flexConfig = await baseStep.overrideFrontEndFlagr({
      flagName: FLEXIBLE_CALENDAR_CONFIG,
      flagOptions: optionsFlexConfig,
      isFirstQueryParam: false
    })

    await baseStep.openPage(ORIGIN_IS_MOSCOW + flexConfig)

    await mainPageWidget.goToWeekendsService()
    await weekendsService.assertThatWeekendsCityListIsVisible()
  })
});
