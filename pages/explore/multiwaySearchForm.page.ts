import {expect, Page} from "@playwright/test";
import {
  dateInCalendarFormat,
  dateInCollapsedFormFormat,
  dateInSearchForm,
  selectMonthFormat
} from "../../utils/DateFormarter";
import {allure} from "allure-playwright";

export class MultiwaySearchFormPage {
  readonly multiwaySearchForm = this.page.getByTestId('multiway-form');
  readonly selectMonth = this.page.getByTestId('select-month');
  readonly formSubmitButton = this.page.getByTestId('form-submit');
  readonly addDirectionButton = this.page.getByTestId('multiway-add-direction');
  readonly mainSearchFormButton = this.page.getByTestId('switch-to-aviaform');

  constructor(private readonly page: Page) {
  }

  readonly direction = (direction: number) => this.page.getByTestId(`multiway-direction-${direction}`);

  readonly originInput = (direction: number) => this.direction(direction).getByTestId('multiway-origin-input');

  readonly originIata = (direction: number) => this.direction(direction).getByTestId('multiway-origin').getByTestId('iata')

  readonly destinationInput = (direction: number) => this.direction(direction).getByTestId('multiway-destination-input');

  readonly destinationIata = (direction: number) => this.direction(direction).getByTestId('multiway-destination').getByTestId('iata');

  readonly suggestedCity = (city: string) => this.page.getByTestId(`suggested-city-${city}`);

  readonly multiwayDate = (direction: number) => this.direction(direction).getByTestId('multiway-date');

  readonly date = (date: string) => this.page.getByTestId(`date-${date}`);

  readonly collapsedDirection = (direction: number) => this.page.getByTestId(`collapsed-direction-${direction}`);

  readonly collapsedDirectionIatas = (direction: number) => this.collapsedDirection(direction).getByTestId('direction-iatas');

  readonly collapsedDirectionDate = (direction: number, date: string) => this.collapsedDirection(direction).getByTestId(`date-${date}`);

  async fillInSegment(param: { segmentNumber: number, origin: string, destination: string, date: Date }) {
    const {segmentNumber, origin, destination, date} = param;

    await allure.step(`Заполнить сегмент №${segmentNumber}`, async () => {
      await allure.step(`Ввести в поле "Откуда" значение: ${origin}`, async () => {
        await this.originInput(segmentNumber).fill(origin);
        await this.suggestedCity(origin).click();
      });

      await allure.step(`Ввести в поле "Куда" значение: ${destination}`, async () => {
        await this.destinationInput(segmentNumber).fill(destination);
        await this.suggestedCity(destination).click();
      });

      await allure.step(`Выбрать дату: ${dateInCalendarFormat(date)}`, async () => {
        await this.multiwayDate(segmentNumber).click();
        await this.chooseDate(date);
      });
    });
  }

  async addSegment() {
    await allure.step('Добавить сегмент', async () => {
      await this.addDirectionButton.click();
    });
  }

  async startSearch() {
    await allure.step('Запустить поиск', async () => {
      await this.formSubmitButton.click();
    });
  }

  async switchToMainSearchForm() {
    await allure.step('Переключиться на форму обычного поиска', async () => {
      await this.mainSearchFormButton.click();
    });
  }

  async assertThatMultiwaySearchFormAppeared() {
    await allure.step('Форма сложного поиска отображается', async () => {
      await this.multiwaySearchForm.isVisible();
    });
  }

  async assertThatCollapsedFormSegmentIsEqualToExpected(params: {
    segmentNumber: number;
    date: Date;
    origin: string;
    destination: string
  }) {
    const {segmentNumber, date, origin, destination} = params;

    await allure.step(`Проверить, что сегмент №${segmentNumber} в свернутом виде заполнен данными`, async () => {
      await allure.step(`Направление: ${origin} – ${destination}`, async () => {
        const segmentIatas = await this.collapsedDirectionIatas(segmentNumber).textContent();
        expect(segmentIatas).toContain(`${origin} – ${destination}`);
      });

      await allure.step(`Дата: ${dateInSearchForm(date)}`, async () => {
        const segmentDate = await this.collapsedDirectionDate(segmentNumber, dateInCollapsedFormFormat(date)).textContent();
        expect(segmentDate).toContain(dateInSearchForm(date));
      });
    });
  }

  async assertThatSegmentIsEqualToExpected(param: {
    segmentNumber: number;
    originIATA: string;
    date: Date;
    destinationIATA: string
  }) {
    await allure.step(`Проверить, что сегмент №${param.segmentNumber} заполнен данными`, async () => {
      await allure.step(`Откуда: ${param.originIATA}`, async () => {
        const originIATA = await this.originIata(param.segmentNumber).textContent();
        expect(originIATA).toContain(param.originIATA);
      });

      await allure.step(`Куда: ${param.destinationIATA}`, async () => {
        const destinationIATA = await this.destinationIata(param.segmentNumber).textContent();
        expect(destinationIATA).toContain(param.destinationIATA);
      });

      await allure.step(`Дата: ${dateInSearchForm(param.date)}`, async () => {
        const date = await this.multiwayDate(param.segmentNumber).textContent();
        expect(date).toContain(dateInSearchForm(param.date));
      });
    });
  }

  private async chooseDate(date: Date) {
    if (date.getMonth() !== new Date().getMonth()) {
      const monthFormat = selectMonthFormat(date)

      await allure.step(`Выбрать месяц: ${monthFormat}`, async () => {
        await this.selectMonth.selectOption(monthFormat);
      });
    }

    const dateFormatted = dateInCalendarFormat(date);
    await allure.step(`Выбрать дату: ${dateFormatted}`, async () => {
      await this.date(dateFormatted).click();
    });
  }
}
