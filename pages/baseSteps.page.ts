import {Page} from "@playwright/test";
import {allure} from "allure-playwright";

export class BaseSteps {
  constructor(private readonly page: Page) {}

  async openPage(url: string) {
    await allure.step(`Открыть страницу: ${url}`, async () => {
      await this.page.goto(url);
    });
  }
}
