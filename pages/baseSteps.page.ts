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
    await this.page.route(url, route => {
      const body = route.request().postDataJSON()

      if (body.operation_name === operationName) {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(newBody)
        })
      }
    })
  }
}
