import {Page} from "@playwright/test";
import {allure} from "allure-playwright";

export class BaseSteps {
  constructor(private readonly page: Page) {}

  async openPage(url: string) {
    await allure.step(`Открыть страницу: ${url}`, async () => {
      await this.page.goto(url);
    });
  }

  async overrideFrontEndFlagr({flagName, flagOptions, isFirstQueryParam = true}: {
    flagName: string,
    flagOptions?: object,
    isFirstQueryParam?: boolean
  }) {

    const overrideFlag = isFirstQueryParam ? `?ffv2_overrides=` : `&ffv2_overrides=`

    return `${overrideFlag}{"${flagName}":${JSON.stringify(flagOptions)}}`
  }
}
