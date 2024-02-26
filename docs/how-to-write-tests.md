# Как писать тесты

Перед написанием тестов нужно прочитать документацию Playwright о том как писать тесты https://playwright.dev/docs/writing-tests .

## Arrange Act Assert

[AAA](https://automationpanda.com/2020/07/07/arrange-act-assert-a-pattern-for-writing-good-tests/) это отличный способ структурировать тесты, знакомый многим по unit тестам. Он описывает следующий порядок действий:
* **Arrange** - сетап теста. В этом блоке подготавливаются объекты, которые будут переиспользоваться на протяжении всего теста. Например, создаются PageObject объекты, объявляются переменные, константы, ожидаемые значения etc.
* **Act** - непосредственно сам функциональный e2e тест, т.е. взаимодействие с веб - страницей
* **Assert** - шаги валидации какого - то конечного результата после действий, которые выполнил тест. Это может быть проверка состояния, строки, значения etc. В тестах ассертов может быть несколько.


```ts
test('Скрыть виджет "Городов" после выбора города', async ({page}) => {
# Arrange
    await allureTestInfo({id: "8418", owner: "Egor Muratov", team: "Explore"});
    const citiesWidgetPage = new CitiesWidgetPage(page);
    const searchFormPage = new SearchFormPage(page);
    await page.goto(MOSCOW_NP_FLIGHT);
    await searchFormPage.waitForSearchFormToLoad(true)
    await citiesWidgetPage.assertThatCityListIsVisible();

# Act
    const cityName = await citiesWidgetPage.getCityName();
    await citiesWidgetPage.selectCity();
		
# Assert
    await citiesWidgetPage.assertThatCityListIsNotVisible();
    await searchFormPage.assertThatDestinationIsEqualToExpected(cityName);
});
```

Каждый тест начинается с добавления информации о тесте в allure отчет. Это делается с помощью функции allureTestInfo. В нее передается объект с информацией о тесте.  Что такое Allure читать [тут](/docs/allure.md).

Каждый текст должен содержать те же шаги что написаны в эталонном тест-кейсе. 

Стараемся не использовать захаркодженные значения в тестах, а выносить их в константы или в отдельные тестовые данные. Например, в этом тесте вместо того, чтобы писать `await page.goto('https://www.aviasales.ru/')` мы используем константу `MOSCOW_NP_FLIGHT`. 

`beforeEach` - это функция, которая выполняется перед каждым тестом. В ней можно описать общие для всех тестов шаги. Например, открытие страницы и ожидание загрузки формы поиска. https://playwright.dev/docs/api/class-test#test-before-each-1

```ts
test.beforeEach(async ({page}) => {
  const baseStep = new BaseSteps(page)
  const searchFormPage = new SearchFormPage(page);

  await baseStep.openPage(MOSCOW_NP_FLIGHT);
  await searchFormPage.waitForSearchFormToLoad(true)
});
```

Аналогичная ситуация если после каждого теста нужно сделать то используем `afterEach`. https://playwright.dev/docs/api/class-test#test-after-each-1




## Page Object Model

В тестах используем степы которые оформлены в классы согласно паттерну Page Object. [Тут](https://playwright.dev/docs/pom) дока от Playwright, а тут какой-то [рандомный туториал](https://anandhik.medium.com/page-object-model-in-playwright-fb1b60597c95).

Пример: 
```ts
import {Page} from "@playwright/test";
import {dateInCalendarFormat} from "../../utils/DateFormarter";
import {allure} from "allure-playwright";

export class CalendarPage {
  constructor(private readonly page: Page) {}

  readonly date = (date: string) => this.page.getByTestId(`date-${date}`)
  readonly calendarActionButton = this.page.getByTestId('calendar-action-button');

  async selectTripDurationDates(startDate: Date, endDate?: Date) {
    await allure.step(`Выбор даты вылета`, async () => {
      await this.chooseDate(startDate);
    });

    if (endDate) {
      await allure.step(`Выбор даты возвращения`, async () => {
        await this.chooseDate(endDate);
      });
    } else {
      await allure.step('Клик по кнопке "Обратный билет не нужен"', async () => {
        await this.calendarActionButton.click()
      });
    }
  }

  private async chooseDate(date: Date) {
    const dateInCalendar = dateInCalendarFormat(date);

    await allure.step(`Выбрать дату ${dateInCalendar}`, async () => {
      await this.date(dateInCalendar).hover();
      await this.date(dateInCalendar).click();
    });
  }
}
```
Стараемся писать степы максимально атомарными, чтобы их можно было переиспользовать в других тестах. Так же не стоит делать слишком большие классы, лучше разбить их на более мелкие, но логические части.
Каждый степ оборачивается в allure.step, чтобы в отчете Allure было видно, что именно происходило в тесте. Что такое Allure читать [тут](/docs/allure.md).
