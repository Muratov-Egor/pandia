import {test} from "@playwright/test";
import {FLEXIBLE_CALENDAR_CONFIG} from "../constants/Flags";
import {SAINT_PETERSBURG_MOSCOW_FLIGHT} from "../constants/explore/DirectionUrl";
import {BaseSteps} from "../pages/baseSteps.page";
import {allureTestInfo} from "../utils/AllureHelper";
import {WeekendsPricesWidget} from "../pages/explore/weekendsPricesWidget.page";
import {SearchFormPage} from "../pages/explore/searchForm.page";
import {CalendarPage} from "../pages/explore/calendar.page";
import {getTicketInfo} from "../utils/priceTicketLinkPaser";

const optionsFlexConfig = {
  variantKey: "onlyWeekends",
  variantAttachment: {
    config: {"flexibleDates": false, "onlyPopularDestinations": false, "tripPeriod": false, "weekends": true},
    enabled: true
  }
}

test.describe('Выдача цен на выходные', () => {
  test.beforeEach('Включите флаг гибкого календаря и откройте страницу направления', async ({page}) => {
    const baseStep = new BaseSteps(page)
    const searchForm = new SearchFormPage(page);

    const flexConfig = await baseStep.overrideFrontEndFlagr({
      flagName: FLEXIBLE_CALENDAR_CONFIG,
      flagOptions: optionsFlexConfig,
      isFirstQueryParam: false
    })

    await baseStep.openPage(SAINT_PETERSBURG_MOSCOW_FLIGHT + flexConfig)
    await searchForm.waitForSearchFormToLoad(true)
  });

  test('Переход на страницу выдачи /search, при нажатии на мин. прайс', async ({context, page}) => {
    await allureTestInfo({id: "10565", owner: "Egor Muratov", team: "Explore"});


    const searchForm = new SearchFormPage(page);
    const calendar = new CalendarPage(page);
    const weekendsPricesWidget = new WeekendsPricesWidget(page);

    await searchForm.openCalendar()
    await calendar.selectAllWeekends(true)
    const firstTicketLink = await weekendsPricesWidget.getFirstTicketLink()
    const {origin, destination, startDate, endDate} = getTicketInfo(firstTicketLink)
    await weekendsPricesWidget.chooseFirstTicket()

    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
    ])

    const baseStep = new BaseSteps(newPage)
    await baseStep.waitForUrl('**/search/*');
    const searchFormOnResultsPage = new SearchFormPage(newPage);
    await searchFormOnResultsPage.assertThatDirectionIsEqualToExpected(origin, destination)
    await searchFormOnResultsPage.assertThatStartDateIsEqualToExpected(startDate)
    await searchFormOnResultsPage.assertThatEndDateIsEqualToExpected(endDate)
  });

  test('Отсортировать выдачу выходных по цене', async ({page}) => {
    const searchForm = new SearchFormPage(page);
    const calendar = new CalendarPage(page);
    const weekendsPricesWidget = new WeekendsPricesWidget(page);

    await searchForm.openCalendar()
    await calendar.selectAllWeekends()

    await weekendsPricesWidget.assertThatResultSortByMonth()

    await weekendsPricesWidget.sortResultByPrice()

    await weekendsPricesWidget.assertThatResultSortByPrice()
  });
});
