import {test} from "@playwright/test";
import {PriceMapPage} from "../pages/explore/priceMap.page";
import {allureTestInfo} from "../utils/AllureHelper";
import {SearchFormPage} from "../pages/explore/searchForm.page";
import {BaseSteps} from "../pages/baseSteps.page";
import {ORIGIN_IS_KATHMANDU} from "../constants/explore/DirectionUrl";


test.describe('Карта цен', () => {

  test.beforeEach(async ({page}) => {
    const priceMap = new PriceMapPage(page)
    await priceMap.blockMapTiler()
  });

  test('Отображения списка городов выбранной страны на странице карты цен', async ({page}) => {
    await allureTestInfo({owner: "Egor Muratov", team: "Explore", feature: "Карта цен"});

    const baseStep = new BaseSteps(page)
    const priceMap = new PriceMapPage(page)
    const searchForm = new SearchFormPage(page)

    await baseStep.openPage(ORIGIN_IS_KATHMANDU)
    await searchForm.fillInDestination({isAnywhere: true})

    await priceMap.assertThatMapIsLoaded()
    const countryName = await priceMap.getFirstCountryName()
    await priceMap.chooseFirstCountry()
    // @ts-ignore
    await priceMap.assertThatCountryNameIsEqualToExpected(countryName)
    await priceMap.assertThatShowsListCitiesOfTheSelectedCountry()
  })

  test('Переход к странице направления со страницы Карты', async ({page}) => {
    await allureTestInfo({owner: "Egor Muratov", team: "Explore", feature: "Карта цен"});

    const priceMap = new PriceMapPage(page)
    const searchForm = new SearchFormPage(page)

    await page.goto(`/map${ORIGIN_IS_KATHMANDU}`)
    await priceMap.assertThatMapIsLoaded()
    await priceMap.chooseFirstCountry()
    const cityName = await priceMap.getFirstCityName()
    await priceMap.chooseFirstCity()

    // @ts-ignore
    await searchForm.assertThatDestinationIsEqualToExpected(cityName)
    await priceMap.assertThatPriceMapContainerIsHidden()
  })

  // test('Переход на экран карты цен с главного экрана', async ({page}) => {
  //   await allureTestInfo({owner: "Egor Muratov", team: "Explore", feature: "Карта цен"});
  //
  //   const baseStep = new BaseSteps(page)
  //   const priceMap = new PriceMapPage(page)
  //   // const mainPageWidget = new MainPageWidget(page)
  //
  //   await mockMainPage()
  //   await baseStep.openPage('/')
  //   await mainPageWidget.goToPriceMap()
  //
  //   await priceMap.assertThatMapIsLoaded()
  // }
});
