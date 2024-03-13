import {test} from "@playwright/test";
import {allureTestInfo} from "../utils/AllureHelper";
import {BaseSteps} from "../pages/baseSteps.page";
import {PopularDirectionsSEOWidgetPage} from "../pages/explore/popularDirectionsSEOWidget.page";
import {MOSCOW_BANGKOK_FLIGHT} from "../constants/explore/DirectionUrl";
import {SearchFormPage} from "../pages/explore/searchForm.page";

test.describe('Тесты SEO блока "Популярные направления"', () => {
  test('Блок "Популярные направления" отображается на главной странице', async ({page}) => {
    await allureTestInfo({id: "9202", owner: "Egor Muratov", team: "Explore"});

    const baseStep = new BaseSteps(page);
    const searchForm = new SearchFormPage(page);
    const popularDirectionsSEO = new PopularDirectionsSEOWidgetPage(page);

    await baseStep.openPage('/');
    await searchForm.waitForSearchFormToLoad()

    await popularDirectionsSEO.assertThatCityNameBlocksHaveHrefLink();
    await popularDirectionsSEO.assertThatRouteLinkHaveHrefUrl();
  })

  test('Блок "Популярные направления" не отображается на экране направления', async ({page}) => {
    await allureTestInfo({id: "9203", owner: "Egor Muratov", team: "Explore"});

    const baseStep = new BaseSteps(page);
    const popularDirectionsSEO = new PopularDirectionsSEOWidgetPage(page);

    await baseStep.openPage(MOSCOW_BANGKOK_FLIGHT);

    await popularDirectionsSEO.assertThatBlockIsHidden();
  })

  test('Открытие страницы города из блока "Популярные направления"', async ({context, page}) => {
    await allureTestInfo({id: "9204", owner: "Egor Muratov", team: "Explore"});

    const baseStep = new BaseSteps(page);
    const popularDirectionsSEO = new PopularDirectionsSEOWidgetPage(page);

    await baseStep.openPage('/');
    const cityName = await popularDirectionsSEO.getFirstCityName();
    const cityUrl = await popularDirectionsSEO.getUrlOfFirstCityName();
    await popularDirectionsSEO.openFirstCityPage();

    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
    ])

    const searchForm = new SearchFormPage(newPage);
    const newBaseStep = new BaseSteps(newPage);

    await searchForm.waitForSearchFormToLoad(true)
    await searchForm.assertThatDestinationIsEqualToExpected(cityName);
    await newBaseStep.waitForUrl(`**${cityUrl}`);
  })

  test('Открытие страницы маршрута из блока "Популярные направления"', async ({context, page}) => {
    await allureTestInfo({id: "9205", owner: "Egor Muratov", team: "Explore"});

    const baseStep = new BaseSteps(page);
    const popularDirectionsSEO = new PopularDirectionsSEOWidgetPage(page);

    await baseStep.openPage('/');
    const route = await popularDirectionsSEO.getFirstRoute();
    const routeUrl = await popularDirectionsSEO.getUrlOfFirstRoute();
    await popularDirectionsSEO.openFirstRoutePage();

    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
    ])

    const searchForm = new SearchFormPage(newPage);
    const newBaseStep = new BaseSteps(newPage);

    await searchForm.waitForSearchFormToLoad(true)
    await searchForm.assertThatOriginIsEqualToExpected(route.origin);
    await searchForm.assertThatDestinationIsEqualToExpected(route.destination);
    await newBaseStep.waitForUrl(`**${routeUrl}`);
  })
});
