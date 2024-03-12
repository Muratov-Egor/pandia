import {test} from "@playwright/test";
import {BaseSteps} from "../pages/baseSteps.page";
import {MOSCOW_BANGKOK_FLIGHT} from "../constants/explore/DirectionUrl";
import {allureTestInfo} from "../utils/AllureHelper";
import {SearchFormPage} from "../pages/explore/searchForm.page";
import {CalendarPage} from "../pages/explore/calendar.page";
import {nextWeek, tomorrow} from "../utils/GetDate";
import {ExactMinPricesWidgetPage} from "../pages/explore/exactMinPricesWidget.page";
import {IataCityCode} from "../enums/IataCityCode";

test.describe('Тесты виджета "Лучшие цены" при выбранных точных датах', () => {
  test.beforeEach('Окрыть страницу направления и снять отельную галку', async ({page, context}) => {
    const baseStep = new BaseSteps(page);
    const searchForm = new SearchFormPage(page);

    await baseStep.openPage(MOSCOW_BANGKOK_FLIGHT)
    await searchForm.waitForSearchFormToLoad(true)
  });

  test('Переход на страницу /search при нажатии на кнопку Показать все билеты', async ({context, page}) => {
    await allureTestInfo({id: "9847", owner: "Egor Muratov", team: "Explore"});

    const baseStep = new BaseSteps(page);
    const searchForm = new SearchFormPage(page);
    const calendar = new CalendarPage(page);
    const exactMinPrices = new ExactMinPricesWidgetPage(page);

    await searchForm.openCalendar()
    await calendar.selectTripDurationDates(tomorrow, nextWeek)
    await searchForm.uncheckHotelCheckbox()
    await exactMinPrices.showAllTickets()




    await baseStep.waitForUrl('**/search/*');
    await searchForm.assertThatDirectionIsEqualToExpected(IataCityCode.MOW, IataCityCode.BKK)
    await searchForm.assertThatStartDateIsEqualToExpected(tomorrow)
    await searchForm.assertThatEndDateIsEqualToExpected(nextWeek)
  })

  test('Переход на страницу /search при клике по мин прайсу', async ({context, page}) => {
    await allureTestInfo({id: "9851", owner: "Egor Muratov", team: "Explore"});

    const searchForm = new SearchFormPage(page);
    const calendar = new CalendarPage(page);
    const exactMinPrices = new ExactMinPricesWidgetPage(page);

    await searchForm.openCalendar()
    await calendar.selectTripDurationDates(tomorrow)
    await exactMinPrices.chooseFirstPrice()

    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
    ])

    const baseStep = new BaseSteps(newPage);
    const searchFormOnResultsPage = new SearchFormPage(newPage);
    await baseStep.waitForUrl('**/search/*');
    await searchFormOnResultsPage.assertThatDirectionIsEqualToExpected(IataCityCode.MOW, IataCityCode.BKK)
    await searchFormOnResultsPage.assertThatStartDateIsEqualToExpected(tomorrow)
  })
});
