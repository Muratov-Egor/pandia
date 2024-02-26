# Pandia
Pandia is the daughter of Zeus and the Moon goddess Selene. Pandia is the goddess of the full moon and the sister of Ersa.

## Playwright

Playwright — NodeJS-фреймворк для headless-браузерного тестирования. Основной фокус — на скорости и производительности e2e-автотестов

[Документация](https://playwright.dev/docs/intro) 


## Локальная работа с проектом

На компьютере должна быть установлена платформа Node.js. Чтобы удобнее контролировать её версии, лучше воспользоваться [nvm](https://github.com/nvm-sh/nvm) или [asdf](https://asdf-vm.com).

Убедись, что Node.js установлена:

```
node -v
```

> Проект использует менеджер зависимостей `yarn`. Пожалуйста, не пытайся использовать `npm`. Если у тебя на компьютере нет `yarn`, то обязательно установи его по [этой инструкции](https://yarnpkg.com/getting-started/install).

Убедись, что `yarn` установлен:

```
yarn -v
```

Поставь зависимости:

```
yarn install
```

### Полезные команды

- Запустить все тесты — `yarn test`
> По умолчанию тесты запускаются против https://www.aviasales.ru/. Чтобы запустить тесты против другого URL необходимо передать переменную окружения `URL` в командной строке. Например, `URL=https://wayaway.io/ yarn test`
- Открыть тест-панель и запускать тесты в ручном режиме — `yarn ui-test`
- Сформировать отчет — `yarn report`
- Очистить отчеты — `yarn report:clean`


## Документация
- [Как писать тесты](docs/how-to-write-tests.md)
- [Allure](docs/allure.md)
