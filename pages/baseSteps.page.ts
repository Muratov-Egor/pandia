import {Page} from "@playwright/test";
import {allure} from "allure-playwright";

export class BaseSteps {
  constructor(private readonly page: Page) {}

  async openPage(url: string) {
    await allure.step(`Открыть страницу: ${url}`, async () => {
      await this.page.goto(url, {waitUntil: "domcontentloaded"});
    });
  }

  async overrideFrontEndFlagr({flagName, flagOptions, isFirstQueryParam = true}: {
    flagName: string,
    flagOptions?: object,
    isFirstQueryParam?: boolean
  }) {
    return await allure.step(`Переопределение флага: ${flagName}}`, async () => {
      const overrideFlag = isFirstQueryParam ? `?ffv2_overrides=` : `&ffv2_overrides=`

      return `${overrideFlag}{"${flagName}":${JSON.stringify(flagOptions)}}`
    });
  }

  async waitForUrl(url: string) {
    await allure.step(`Ожидание перехода на страницу: ${url}`, async () => {
      await this.page.waitForURL(url, {waitUntil: "domcontentloaded", timeout: 50000});
    });
  }

  async mockGraphQlResponse(url: string, operationName: string, newBody: object = {}) {
    await allure.step(`Мокирование ответа на запрос ${operationName} по адресу ${url}`, async () => {
      await this.page.route(url, route => {
        if (route.request().postData().includes(operationName)) {
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(newBody)
          });
        } else {
          route.continue();
        }
      });
    });
  }
}
