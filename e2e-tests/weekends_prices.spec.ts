import {test} from "@playwright/test";
import {SAINT_PETERSBURG_MOSCOW_FLIGHT} from "../constants/explore/DirectionUrl";
import {BaseSteps} from "../pages/baseSteps.page";
import {allureTestInfo} from "../utils/AllureHelper";
import {WeekendsPricesWidget} from "../pages/explore/weekendsPricesWidget.page";
import {SearchFormPage} from "../pages/explore/searchForm.page";
import {CalendarPage} from "../pages/explore/calendar.page";
import {getTicketInfo} from "../utils/priceTicketLinkPaser";

test.describe('Выдача цен на выходные', () => {
  test.beforeEach('Открыть страницу направления', async ({page}) => {
    const baseStep = new BaseSteps(page)
    const searchForm = new SearchFormPage(page);

    await baseStep.openPage(SAINT_PETERSBURG_MOSCOW_FLIGHT)
    await searchForm.waitForSearchFormToLoad(true)
  });

  test('Переход на страницу выдачи /search, при нажатии на мин. прайс', async ({context, page}) => {
    await allureTestInfo({owner: "Egor Muratov", team: "Explore", feature: "На выходные"});

    const searchForm = new SearchFormPage(page);
    const calendar = new CalendarPage(page);
    const weekendsPricesWidget = new WeekendsPricesWidget(page);

    await searchForm.openCalendar()
    await calendar.selectAllWeekends(true)
    let firstTicketLink = await weekendsPricesWidget.getFirstTicketLink()
    // @ts-ignore
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
    await allureTestInfo({owner: "Egor Muratov", team: "Explore", feature: "На выходные"});

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
