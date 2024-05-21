import { Actions } from "@/actions/editor";
import { SuggestionItem } from "@/actions/types";
import Fuse from "fuse.js";
import pinyin from "pinyin";

const getSuggestionItems = (query: { query: string }): SuggestionItem[] => {
  const actionList = Object.keys(Actions)
    .map((name) => Actions[name])
    .filter((action) => action.command && (action.title || action.id))
    .map((item) => ({
      ...item,
      id: item.id || item.title,
      titlePinyin: item.title
        ? pinyin(item.title, { style: pinyin.STYLE_NORMAL }).flat().join("")
        : "",
      descriptionPinyin: item.description
        ? pinyin(item.description, { style: pinyin.STYLE_NORMAL })
            .flat()
            .join("")
        : "",
      namePinyin: item.name
        ? pinyin(item.name, { style: pinyin.STYLE_NORMAL }).flat().join("")
        : "",
    }));
  const options = {
    includeScore: true,
    keys: [
      "title",
      "description",
      "name",
      "titlePinyin",
      "descriptionPinyin",
      "namePinyin",
    ],
  };
  // console.log(Actions, actionList);

  const fuse = new Fuse(actionList, options);
  const items = query.query
    ? fuse.search(query.query).map((item) => item.item)
    : actionList;
  return items.slice(0, 20);
};

export default getSuggestionItems;
