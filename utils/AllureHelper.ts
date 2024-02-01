import {allure} from "allure-playwright";

export async function allureTestInfo(param: {id: string, owner?: string, team?: string}) {
  const {id, owner, team} = param;

  await allure.id(id);
  owner ? await allure.owner(owner) : null;
  team ? await allure.parameter("team", team) : null;
}
