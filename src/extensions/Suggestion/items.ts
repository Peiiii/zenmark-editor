import { Actions } from "@/actions";
import Fuse from "fuse.js";
const getSuggestionItems = (query) => {
  const actionList = Object.keys(Actions)
    .map((name) => Actions[name])
    .filter((action) => action.command);
  const options = {
    includeScore: true,
    keys: ["title", "description"],
  };
  // console.log(Actions, actionList);

  const fuse = new Fuse(actionList, options);
  const items = query.query
    ? fuse.search(query.query).map((item) => item.item)
    : actionList;
  return items.slice(0, 20);
};

export default getSuggestionItems;
