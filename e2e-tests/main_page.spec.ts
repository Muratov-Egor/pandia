import {test} from "@playwright/test";
import {BaseSteps} from "../pages/baseSteps.page";
import {ARIADNE_GRAPHQL_ROUTE, MAIN_PAGE_OPERATION_NAME} from "../constants/Ariadne";
import {MAIN_PAGE_BLOCKS} from "../fixtures/explore/main_page_blocks";
import {allureTestInfo} from "../utils/AllureHelper";
import {MainPageWidgetPage} from "../pages/explore/mainPageWidget.page";
import {TravelMapPage} from "../pages/guides/TravelMap.page";
import {SearchFormPage} from "../pages/explore/searchForm.page";
import {ORIGIN_IS_MOSCOW} from "../constants/explore/DirectionUrl";
import {hotTicketInfo} from "../test-data/HotTicketInfo";
import {NEW_SALO_MARKET} from "../constants/CommonURL";
import {CitiesWidgetPage} from "../pages/explore/citiesWidget.page";

test.describe('Главная страница', () => {
  test('Переход на страницу /search из блока "Горячие билеты" на главном экране', async ({context, page}) => {
    await allureTestInfo({id: "9602", owner: "Egor Muratov", team: "Explore"});

    const baseSteps = new BaseSteps(page);
    const mainPage = new MainPageWidgetPage(page);


    await baseSteps.mockGraphQlResponse(ARIADNE_GRAPHQL_ROUTE, MAIN_PAGE_OPERATION_NAME, MAIN_PAGE_BLOCKS);
    await baseSteps.openPage('/');

    await mainPage.chooseHotTicket();

    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
    ])

    const resultPage = new BaseSteps(newPage);
    const searchForm = new SearchFormPage(newPage);

    await resultPage.waitForUrl('**/search/*');
    await searchForm.assertThatDirectionIsEqualToExpected(hotTicketInfo.origin, hotTicketInfo.destination)
    await searchForm.assertThatStartDateIsEqualToExpected(hotTicketInfo.data)
  })

  test('Переход на страницу Блога из Блока Блог на главном экране', async ({context, page}) => {
    await allureTestInfo({id: "9837", owner: "Egor Muratov", team: "Explore"});

    const baseSteps = new BaseSteps(page);
    const mainPage = new MainPageWidgetPage(page);

    await baseSteps.mockGraphQlResponse(ARIADNE_GRAPHQL_ROUTE, MAIN_PAGE_OPERATION_NAME, MAIN_PAGE_BLOCKS);
    await baseSteps.openPage('/');

    const blogURL = await mainPage.getBlogURL()
    await mainPage.goToBlog();

    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
    ])

    const blogPage = new BaseSteps(newPage);
    await blogPage.waitForUrl(blogURL);
  })

  test('Открыть модальное окно Guide из блока Promo на главном экране', async ({page}) => {
    await allureTestInfo({id: "9603", owner: "Egor Muratov", team: "Explore"});

    const baseSteps = new BaseSteps(page);
    const mainPage = new MainPageWidgetPage(page);
    const travelMap = new TravelMapPage(page);
    const searchForm = new SearchFormPage(page);

    await baseSteps.mockGraphQlResponse(ARIADNE_GRAPHQL_ROUTE, MAIN_PAGE_OPERATION_NAME, MAIN_PAGE_BLOCKS);
    await baseSteps.openPage(ORIGIN_IS_MOSCOW);
    const promoCityName = await mainPage.getPromoKorocheCityName()

    await searchForm.assertThatOriginIsEqualToExpected(promoCityName)

    await mainPage.goToCityPromoKoroche();

    await travelMap.assertThatTravelModalIsOpened()
  })

  test('Переход на экран страны из блока "Популярные направления" на главном экране', async ({context, page}) => {
    await allureTestInfo({id: "9387", owner: "Egor Muratov", team: "Explore"});

    const baseSteps = new BaseSteps(page);
    const mainPage = new MainPageWidgetPage(page);
    const searchForm = new SearchFormPage(page);
    const citiesWidget = new CitiesWidgetPage(page)

    await baseSteps.mockGraphQlResponse(ARIADNE_GRAPHQL_ROUTE, MAIN_PAGE_OPERATION_NAME, MAIN_PAGE_BLOCKS);
    await baseSteps.openPage(NEW_SALO_MARKET);

    const countryName = await mainPage.getFirstPopularCountryName()
    await mainPage.goToFirstPopularCountry();

    await searchForm.assertThatDestinationIsEqualToExpected(countryName)
    await citiesWidget.assertThatCityListIsVisible()
  })
})
