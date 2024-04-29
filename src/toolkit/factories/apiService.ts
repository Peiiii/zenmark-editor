/* eslint-disable @typescript-eslint/no-explicit-any */
import { SafeAny } from "@/toolkit/types";
import { snakeCase } from "lodash";

type IApiServiceMethods = {
  [service: string]: {
    [action: string]: (params: SafeAny) => Promise<SafeAny>;
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const recursiveSnakeCase = (value: any): any => {
  if (Array.isArray(value)) {
    // 如果值是数组，则递归调用该函数处理数组中的每个元素
    return value.map(recursiveSnakeCase);
  } else if (typeof value === "object" && value !== null) {
    // 如果值是对象，则递归调用该函数处理对象的键和值
    const result: Record<string, unknown> = {};
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        result[snakeCase(key)] = recursiveSnakeCase(value[key]);
      }
    }
    return result;
  } else {
    // 否则直接转换值为snakeCase
    return value;
  }
};

export function createApiService<T extends IApiServiceMethods>(
  { baseUrl }: { baseUrl: string },
  postProcess?: (...args: any[]) => any
): T {
  const apiServiceProxy = new Proxy(
    {},
    {
      get(_, service) {
        return new Proxy(
          {},
          {
            get(_, action) {
              return (params: Record<string, SafeAny>) => {
                const requestData = {
                  service: service.toString(),
                  action: snakeCase(action.toString()),
                  params: recursiveSnakeCase(params),
                };

                return fetch(baseUrl, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "x-session-id": localStorage.getItem("session_id") || "",
                  },
                  body: JSON.stringify(requestData),
                })
                  .then((response) => response.json())
                  .then((data) => {
                    return postProcess?.(data) || data;
                  });
              };
            },
          }
        );
      },
    }
  );

  return apiServiceProxy as T;
}
