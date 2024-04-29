import classNames from "classnames";

type WithClassName<T> = T & {
  className?: string;
};

export function withDefaultProps<P>(
  Component: React.ComponentType<P>,
  defaultProps: WithClassName<Partial<P>> | (() => WithClassName<Partial<P>>)
) {
  return (props: WithClassName<P>) => {
    const innerDefaultProps =
      typeof defaultProps === "function" ? defaultProps() : defaultProps;
    if (props.className && innerDefaultProps.className) {
      props = {
        ...props,
        className: classNames(innerDefaultProps.className, props.className),
      };
    }
    return <Component {...innerDefaultProps} {...props} />;
  };
}
