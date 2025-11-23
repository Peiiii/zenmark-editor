import classNames from "classnames";
import { useState } from "react";
// Assume items is an array of objects, each with an `id`, `title`, `icon`, and `children` property.
// `children` is an array of objects, each with an `id` and `title` property.

function MenuItemSelect({ items, editor }) {
  const [activeIndex, setActiveIndex] = useState(() =>
    items.indexOf(items.find((item) => item.isActive(editor)))
  );
  const [expanded, setExpanded] = useState(false);
  const activeItem = items[activeIndex] || items[0];
  const { icon: Icon } = activeItem;

  const handleItemClick = (itemId) => {
    const item=items.find((item) => item.id === itemId);
    item.action(editor);
    setExpanded(false);
    setActiveIndex(items.indexOf(items.find((item) => item.id === itemId)));
  };

  return (
    <div
      style={{
        position: "relative",
      }}
      className={classNames("zenmark-menu-item-select", {
        expanded,
      })}
    >
      <span
        className={`zenmark-menu-item ${expanded ? "expanded" : ""}`}
        onClick={() => {
          setExpanded(!expanded);
        }}
        title={activeItem.title}
      >
        <Icon />
      </span>
      {/* <div
        style={{
          position: "relative",
          zIndex: 1000000,
        }}
      > */}
      {expanded && (
        <div
          className="zenmark-menu-dropdown"
          style={{
            position: "fixed",
            zIndex: 1000,
          }}
        >
          {items.map((item, index) => (
            <span
              key={item.id}
              className={`zenmark-menu-item ${
                activeIndex === index ? "is-active" : ""
              }`}
              onClick={(e) => {
                console.log("item:", item);
              
                handleItemClick(item.id);
              }}
              title={item.title}
            >
              <item.icon />
            </span>
          ))}
        </div>
      )}
      {/* </div> */}
    </div>
  );
}

export default MenuItemSelect;
