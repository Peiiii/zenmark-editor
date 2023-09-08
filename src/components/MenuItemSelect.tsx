import { Fragment, useState } from "react";
import "../css/MenuItem.scss";

export default ({ items, editor }: any) => {
  const [activeIndex, setActiveIndex] = useState(() =>
    items.indexOf(items.find((item: any) => item.isActive(editor)))
  );
  const activeItem = items[activeIndex] || items[0];
  const { icon: Icon } = activeItem;
  const [expanded, setExpanded] = useState(false);

  return (
    <div
    //  style={{ width: "2rem" }}
    //  onBlur={() => setExpanded((expanded) => !expanded)}
    >
      <div style={{ display: "flex" }}>
        <button
          className={`menu-item`}
          onClick={() => setExpanded((expanded) => !expanded)}
          title={activeItem.title}
        >
          <Icon />
        </button>
      </div>
      <div style={{ position: "absolute" }}>
        {expanded && (
          <div
            className="dropdown"
            onBlur={() => setExpanded((expanded) => !expanded)}
            style={{ position: "relative", background: "white" }}
          >
            {items.map((item: any, index: any) => {
              const { isActive, title, icon: Icon, action } = item;
              return (
                <Fragment key={index}>
                  <div key={index}>
                    <button
                      className={`menu-item${
                        isActive && isActive(editor) ? " is-active" : ""
                      }`}
                      onClick={() => {
                        action(editor);
                        setActiveIndex(index);
                      }}
                      title={title}
                    >
                      <Icon />
                    </button>
                  </div>
                </Fragment>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
