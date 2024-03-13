import {test} from "@playwright/test";
import {allureTestInfo} from "../utils/AllureHelper";
import {BaseSteps} from "../pages/baseSteps.page";
import {MainPageWidgetPage} from "../pages/explore/mainPageWidget.page";
import {SearchFormPage} from "../pages/explore/searchForm.page";
import {NearbyAirportsPage} from "../pages/explore/nearbyAirports.page";
import {ARIADNE_GRAPHQL_ROUTE, MAIN_PAGE_OPERATION_NAME} from "../constants/Ariadne";
import {MAIN_PAGE_BLOCKS} from "../fixtures/explore/main_page_blocks";
import {DESTINATION_IS_BAIKAL} from "../constants/explore/DirectionUrl";

test.describe('Национальные парки', () => {
  test('Переход на страницу "Национальный парк" из блока Локации на главном экране', async ({page}) => {
    await allureTestInfo({id: "9842", owner: "Egor Muratov", team: "Explore"});

    const baseSteps = new BaseSteps(page)
    const mainPage = new MainPageWidgetPage(page);
    const searchForm = new SearchFormPage(page);
    const nearbyAirports = new NearbyAirportsPage(page);

    await baseSteps.mockGraphQlResponse(ARIADNE_GRAPHQL_ROUTE, MAIN_PAGE_OPERATION_NAME, MAIN_PAGE_BLOCKS);
    await baseSteps.openPage('/');
    const firstParkName = await mainPage.getFirstLocationName();
    await mainPage.chooseFirstLocation();

    await searchForm.assertThatDestinationIsEqualToExpected(firstParkName);
    await nearbyAirports.assertThatNearbyWidgetIsVisible();
  });

  test('Переход на экран направления из виджета близлежащих аэропортов', async ({page}) => {
    await allureTestInfo({id: "9844", owner: "Egor Muratov", team: "Explore"});

    const baseSteps = new BaseSteps(page)
    const nearbyAirports = new NearbyAirportsPage(page);
    const searchForm = new SearchFormPage(page);


    await baseSteps.openPage(DESTINATION_IS_BAIKAL);
    const firstAirportName = await nearbyAirports.getFirstNearbyAirportName();
    await nearbyAirports.goToFirstNearbyAirport();

    await searchForm.assertThatDestinationIsEqualToExpected(firstAirportName);
  });
});
