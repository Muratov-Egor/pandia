# Как писать тесты

Перед написанием тестов нужно прочитать документацию Playwright о том как писать тесты https://playwright.dev/docs/writing-tests .


## **Бекенды**
Отдаём предпочтения мокам бекэнда. Моки это классно и хорошо, лучше использовать, но иногда можно и без них. Проблема моков, что их тяжело создавать и поддерживать. 
Любой тест может быть написан без использования моков, если он остается надежным и быстрым. Но если тест падает из-за бека, то его нужно перевести на моки.

## Arrange Act Assert

AAA это отличный способ структурировать тесты, знакомый многим по unit тестам. Он описывает следующий порядок действий:
* **Arrange** - сетап теста. В этом блоке подготавливаются объекты, которые будут переиспользоваться на протяжении всего теста. Например, создаются PageObject объекты, объявляются переменные, константы, ожидаемые значения etc.
* **Act** - непосредственно сам функциональный e2e тест, т.е. взаимодействие с веб - страницей
* **Assert** - шаги валидации какого - то конечного результата после действий, которые выполнил тест. Это может быть проверка состояния, строки, значения etc. В тестах ассертов может быть несколько


```js
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
