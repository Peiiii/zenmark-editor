import "../css/MenuItem.scss";

export default ({
  icon: Icon,
  title,
  action,
  isActive = null,
  editor,
}: any) => (
  <button
    className={`menu-item${isActive && isActive(editor) ? " is-active" : ""}`}
    onClick={() => {
      action(editor);
    }}
    title={title}
  >
    {<Icon />}
  </button>
);
