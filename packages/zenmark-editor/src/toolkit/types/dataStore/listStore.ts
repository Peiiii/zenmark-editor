/* eslint-disable @typescript-eslint/no-explicit-any */
type ComparisonOperator =
  | "eq"
  | "neq"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "in"
  | "nin"
  | "like";

interface ComparisonFilter {
  field: string;
  operator: ComparisonOperator;
  value: any; // 比较值
}

interface LogicalOperatorFilter {
  operator: "and" | "or";
  conditions: QueryFilter[];
}

type QueryFilter = ComparisonFilter | LogicalOperatorFilter;

interface SortCriteria {
  field: string;
  order: "asc" | "desc";
}

interface ListQueryParams {
  filters?: QueryFilter[];
  sort?: SortCriteria[];
  pageIndex?: number;
  pageSize?: number;
  cursor?: string; // 支持基于游标的分页
}

type ID = number | string;
export interface IListStore<T = any> {
  // 批量添加，返回新增项的ID数组
  addItems(items: T[]): Promise<ID[]>;

  // 单项添加，返回新增项的ID
  addItem(item: T): Promise<ID>;

  // 根据ID获取项
  getItemById(id: ID): Promise<T | undefined>;

  // 根据索引获取项，仅在特定场景下使用
  getItemByIndex?(index: number): Promise<T | undefined>;

  // 根据ID更新项
  updateItemById(id: ID, item: T): Promise<void>;

  // 根据索引更新项，仅在特定场景下使用
  updateItemByIndex?(index: number, item: T): Promise<void>;

  // 根据ID删除项
  removeItemById(id: ID): Promise<void>;

  // 根据索引删除项，仅在特定场景下使用
  removeItemByIndex?(index: number): Promise<void>;

  // 查询项，返回项数组和可能的下一页游标
  queryItems(
    params?: ListQueryParams
  ): Promise<{ items: T[]; nextCursor?: string }>;
}
