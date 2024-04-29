// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mergeProps = <T extends Record<string, any>>(defaultProps: T) => {
  return (props?: Partial<T>) => Object.assign({}, defaultProps, props) as T;
};
