import {test} from '@playwright/test';
import {allureTestInfo} from "../utils/AllureHelper";
import {SearchFormPage} from "../pages/explore/searchForm.page";
import {CalendarPage} from "../pages/explore/calendar.page";
import {IataAirportCode} from "../enums/IataAirportCode";
import {IataCityCode} from "../enums/IataCityCode";
import {nextWeek, today} from "../utils/GetDate";
import {MOSCOW_LONDON_WITH_DATES_21JUNE_17JULY} from "../constants/explore/DirectionUrl";
import {BaseSteps} from "../pages/baseSteps.page";

test('После запуска поиска на странице /search серчфома остается заполненной', async ({page}) => {
  await allureTestInfo({id: "9435", owner: "Egor Muratov", team: "Explore"});

  const baseStep = new BaseSteps(page)
  const searchFormPage = new SearchFormPage(page);
  const calendar = new CalendarPage(page);

  await baseStep.openPage('/');
  await searchFormPage.waitForSearchFormToLoad();

  await searchFormPage.fillInOrigin({airportIata: IataAirportCode.VKO});
  await searchFormPage.fillInDestination({cityIata: IataCityCode.LED});
  await searchFormPage.openCalendar();
  await calendar.selectTripDurationDates(today, nextWeek);
  await searchFormPage.selectNumberOfPassengerAndTripClass({adults: 3, children: 2, infant: 2, tripClass: 'C'});
  await searchFormPage.uncheckHotelCheckbox();
  await searchFormPage.startSearch();

  await baseStep.waitForUrl('**/search/*');
  await searchFormPage.assertThatDirectionIsEqualToExpected(IataAirportCode.VKO, IataCityCode.LED);
  await searchFormPage.assertThatStartDateIsEqualToExpected(today);
  await searchFormPage.assertThatEndDateIsEqualToExpected(nextWeek);
  await searchFormPage.assertThatNumberOfPassengersIsEqualToExpected(7)
  await searchFormPage.assertThatTripClassIsEqualToExpected('Бизнес');
});

test('Открытие предварительно заполненной формы поиска по прямой ссылке', async ({page}) => {
  await allureTestInfo({id: "9434", owner: "Egor Muratov", team: "Explore"});

  const baseStep = new BaseSteps(page)
  const searchFormPage = new SearchFormPage(page);

  await baseStep.openPage(MOSCOW_LONDON_WITH_DATES_21JUNE_17JULY);

  await searchFormPage.assertThatDirectionIsEqualToExpected(IataCityCode.MOW, IataCityCode.LON);
  await searchFormPage.assertThatStartDateIsEqualToExpected(new Date('June 21'));
  await searchFormPage.assertThatEndDateIsEqualToExpected(new Date('July 17'));
});
