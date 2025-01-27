import React, { useState } from "react";

// Assume items is an array of objects, each with an `id`, `title`, `icon`, and `children` property.
// `children` is an array of objects, each with an `id` and `title` property.

function MenuItemSelect({ items, editor }) {
  const [activeIndex, setActiveIndex] = useState(() =>
    items.indexOf(items.find((item) => item.isActive(editor)))
  );
  const [expandedItem, setExpandedItem] = useState(null);
  const activeItem = items[activeIndex] || items[0];
  const { icon: Icon } = activeItem;

  const handleItemClick = (itemId) => {
    setExpandedItem(expandedItem === itemId ? null : itemId);
  };

  return (
    <div>
      <div style={{ display: "flex" }}>
        {items.map((item) => (
          <button
            key={item.id}
            className={`menu-item ${
              expandedItem === item.id ? "expanded" : ""
            }`}
            onClick={() => handleItemClick(item.id)}
            title={item.title}
          >
            <item.icon />
            {expandedItem === item.id && (
              <div className="dropdown">
                {item.children.map((child) => (
                  <button
                    key={child.id}
                    className="menu-item"
                    title={child.title}
                  >
                    {child.title}
                  </button>
                ))}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default MenuItemSelect;
