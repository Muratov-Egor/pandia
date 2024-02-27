import {test} from "@playwright/test";
import {SearchFormPage} from "../pages/explore/searchForm.page";
import {MultiwaySearchFormPage} from "../pages/explore/multiwaySearchForm.page";
import {firstSegment, secondSegment, thirdSegment} from "../test-data/MultiwayDirections";
import {allureTestInfo} from "../utils/AllureHelper";
import {MULTIWAY_PARAMS_MOW_IST_5JULY_IST_LON_9OCTOBER} from "../constants/explore/DirectionUrl";
import {IataCityCode} from "../enums/IataCityCode";
import {BaseSteps} from "../pages/baseSteps.page";

test('Запуск поиска из сложной формы поиска', async ({page}) => {
  await allureTestInfo({id: "9389", owner: "Egor Muratov", team: "Explore"})

  const baseStep = new BaseSteps(page)
  const searchForm = new SearchFormPage(page);
  const multiwaySearchForm = new MultiwaySearchFormPage(page);

  await baseStep.openPage('/');
  await searchForm.waitForSearchFormToLoad();

  await searchForm.switchToMultiwaySearchForm();

  await multiwaySearchForm.assertThatMultiwaySearchFormAppeared();
  await multiwaySearchForm.fillInSegment(firstSegment);
  await multiwaySearchForm.fillInSegment(secondSegment);
  await multiwaySearchForm.addSegment();
  await multiwaySearchForm.fillInSegment(thirdSegment)
  await multiwaySearchForm.startSearch();

  await baseStep.waitForUrl('**/search/*');
  await multiwaySearchForm.assertThatCollapsedFormSegmentIsEqualToExpected(firstSegment);
  await multiwaySearchForm.assertThatCollapsedFormSegmentIsEqualToExpected(secondSegment);
  await multiwaySearchForm.assertThatCollapsedFormSegmentIsEqualToExpected(thirdSegment);
});

test('Открытие предварительно заполненной сложной формы поиска по прямой ссылке', async ({page}) => {
  await allureTestInfo({id: "9433", owner: "Egor Muratov", team: "Explore"})

  const baseStep = new BaseSteps(page)
  const multiwaySearchForm = new MultiwaySearchFormPage(page);

  await baseStep.openPage(MULTIWAY_PARAMS_MOW_IST_5JULY_IST_LON_9OCTOBER);

  await multiwaySearchForm.assertThatMultiwaySearchFormAppeared();
  await multiwaySearchForm.assertThatSegmentIsEqualToExpected({
    segmentNumber: 1,
    originIATA: IataCityCode.MOW,
    destinationIATA: IataCityCode.IST,
    date: new Date('July 5')
  })
  await multiwaySearchForm.assertThatSegmentIsEqualToExpected({
    segmentNumber: 2,
    originIATA: IataCityCode.IST,
    destinationIATA: IataCityCode.LON,
    date: new Date('October 9')
  })
});
