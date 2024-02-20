import {test} from '@playwright/test';
import {allureTestInfo} from "../utils/AllureHelper";
import {SearchFormPage} from "../pages/explore/searchForm.page";
import {CalendarPage} from "../pages/explore/calendar.page";
import {IataAirportCode} from "../enums/IataAirportCode";
import {IataCityCode} from "../enums/IataCityCode";
import {nextWeek, today} from "../utils/GetDate";
import {MOSCOW_LONDON_WITH_DATES_21JUNE_17JULY} from "../constants/explore/DirectionUrl";

test('После запуска поиска на странице /search серчфома остается заполненной', async ({page}) => {
  await allureTestInfo({id: "9435", owner: "Egor Muratov", team: "Explore"});

  const searchFormPage = new SearchFormPage(page);
  const calendar = new CalendarPage(page);

  await page.goto('/');
  await searchFormPage.waitForSearchFormToLoad();

  await searchFormPage.fillInOrigin({airportIata: IataAirportCode.VKO});
  await searchFormPage.fillInDestination({cityIata: IataCityCode.LED});
  await searchFormPage.openCalendar();
  await calendar.selectTripDurationDates(today, nextWeek);
  await searchFormPage.selectNumberOfPassengerAndTripClass({adults: 3, children: 2, infant: 2, tripClass: 'C'});
  await searchFormPage.uncheckHotelCheckbox();
  await searchFormPage.startSearch();
  await page.waitForURL('**/search/*');

  await searchFormPage.assertThatDirectionIsEqualToExpected('Внуково', 'Санкт-Петербург');
  await searchFormPage.assertThatStartDateIsEqualToExpected(today);
  await searchFormPage.assertThatEndDateIsEqualToExpected(nextWeek);
  await searchFormPage.assertThatNumberOfPassengersIsEqualToExpected(7)
  await searchFormPage.assertThatTripClassIsEqualToExpected('Бизнес');
});

test('Открытие предварительно заполненной формы поиска по прямой ссылке', async ({page}) => {
  await allureTestInfo({id: "9434", owner: "Egor Muratov", team: "Explore"});

  const searchFormPage = new SearchFormPage(page);
  await page.goto(MOSCOW_LONDON_WITH_DATES_21JUNE_17JULY);

  await searchFormPage.assertThatDirectionIsEqualToExpected('Москва', 'Лондон');
  await searchFormPage.assertThatStartDateIsEqualToExpected(new Date('June 21'));
  await searchFormPage.assertThatEndDateIsEqualToExpected(new Date('July 17'));
});
