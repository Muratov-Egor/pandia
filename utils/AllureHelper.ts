import {allure} from "allure-playwright";

export async function allureTestInfo(param: { owner?: string, team?: string }) {
  const {owner, team} = param;

  owner ? await allure.owner(owner) : null;
  team ? await allure.parameter("team", team) : null;
}
