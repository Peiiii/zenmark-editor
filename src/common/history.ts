const realHistory = window.history;
const realLocation = document.location;
const updateUrlParameter = (parameterName: string, newValue: string) => {
  // 获取当前地址栏的URL
  var url = window.location.href;

  // 解析URL获取参数
  var searchParams = new URLSearchParams(url);

  // 修改参数的值
  searchParams.set(parameterName, newValue);

  // 创建新的URL
  var newUrl = window.location.pathname + "?" + searchParams.toString();

  // 修改地址栏URL但不更新页面标题
  window.history.pushState("", "", newUrl);
  console.log("pushState", newUrl);
};
const makeQuery = () => {
  const handler = {
    get(target, prop, receiver) {
      return new URLSearchParams(realLocation.search).get(prop);
    },
    set(target, prop, value) {
        // const query = {};
        // for (let [k, v] of new URLSearchParams(realLocation.search) as any)
        //   query[k] = v;
        // query[prop] = value;
        // const search: string[] = [];
        // Object.keys(query).forEach((key) => {
        //   search.push(`${key}=${query[key]}`);
        // });
        // const searchString = "?" + search.join("&");
        // console.log(searchString);
        // // realLocation.search = searchString;
        // realHistory.pushState('','',);
      updateUrlParameter(prop, value);
      return true;
    },
  };
  return new Proxy({}, handler);
};
type LocationType = Location & {
  query: {
    [k: string]: string;
  };
};
const makeLocation = () => {
  const query = makeQuery();
  const handler = {
    get(target, prop, receiver) {
      if (prop === "query") return query;
      else return target[prop];
    },
  };
  return new Proxy(realLocation, handler);
};
const parse = (): LocationType => {
  return makeLocation();
};
const TransmitionManager = {
  counter: -1,
  bank: {},
  addListener: function (listener: Function) {
    this.counter += 1;
    this.bank[this.counter] = listener;
    return () => {
      delete this.bank[this.counter];
    };
  },
  callAll: function () {
    Object.keys(this.bank).map((key) => this.bank[key](history.location));
  },
};

type HistoryType = {
  location: LocationType;
  length: number;
  push: (
    path: string | { pathname?: string; query?: object },
    update?: boolean
  ) => any;
  createHref: (obj: object) => string;
  listen: (listener: (location: LocationType) => any) => Function;
  update: () => void;
};
const history: HistoryType = {
  location: parse(),
  length: realHistory.length,
  createHref: function (obj: any) {
    let s = "";
    if (obj.query && Object.keys(obj.query).length) {
      s = "?";
      let parts: string[] = [];
      Object.keys(obj.query).map((key) => {
        parts.push(`${key}=${encodeURIComponent(obj.query[key])}`);
      });
      s += parts.join("&");
    }
    return obj.pathname + s;
  },
  push: function (path: string | object, update: boolean = true) {
    if (typeof path === "object") path = this.createHref(path);
    realHistory.pushState({}, "", path);
    this.location = parse();
    this.length = realHistory.length;
    if (update) TransmitionManager.callAll();
  },
  listen: function (listener: (location: LocationType) => any) {
    return TransmitionManager.addListener(listener);
  },
  update: function () {
    this.location = parse();
    this.length = realHistory.length;
    TransmitionManager.callAll();
  },
};
window.onpopstate = (e: any) => {
  history.update();
};
export default history;
export { history };
