/* eslint-disable @typescript-eslint/no-explicit-any */
interface TreeNode<T = any> {
  id: string | number;
  parent?: string | number; // 父节点ID，根节点可不设置
  data: T;
  children?: TreeNode<T>[]; // 子节点，可选，便于表示层次结构
}

interface TreeQueryParams<T = any> {
  rootNodeId?: string | number; // 查询起始节点ID，未设置则从根节点开始
  filter?: (node: TreeNode<T>) => boolean; // 过滤函数
  // 可以添加更多如深度限制等参数
}

export interface ITreeStore<T = any> {
  addNode(node: TreeNode<T>): Promise<void>;
  getNode(id: string | number): Promise<TreeNode<T> | undefined>;
  updateNode(id: string | number, data: T): Promise<void>;
  removeNode(id: string | number): Promise<void>;
  queryNodes(params: TreeQueryParams<T>): Promise<TreeNode<T>[]>;
}
