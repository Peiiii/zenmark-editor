import { Fragment, useState } from "react";
import "../css/MenuItem.scss";

import remixiconUrl from "remixicon/fonts/remixicon.symbol.svg";

export default ({ items, editor }: any) => {
  const [activeIndex, setActiveIndex] = useState(() =>
    items.indexOf(items.find((item: any) => item.isActive(editor)))
  );
  const activeItem = items[activeIndex];
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
            <svg className="remix">
              <use xlinkHref={`${remixiconUrl}#ri-${activeItem.icon}`} />
            </svg>
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
              const { isActive, title, icon, action } = item;
              return (
                <Fragment key={index}>
                  <div
                  key={index}
                  >
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
                      <svg className="remix">
                        <use xlinkHref={`${remixiconUrl}#ri-${icon}`} />
                      </svg>
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
