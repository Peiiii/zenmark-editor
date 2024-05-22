import { useEffect, useRef } from "react";

export const SuggestionItem = ({ item, isSelected, onSelect, id }) => {
  const { icon: Icon, title } = item;
  return (
    <div
      className={`suggestion-item ${isSelected ? "is-selected" : ""}`}
      onClick={onSelect}
    >
      <div className="icon-wrapper">
        <Icon />
      </div>
      <div className="title-wrapper">
        <strong>{title}</strong>
      </div>
    </div>
  );
};

export const SuggestionPanel = ({ items, selectedIndex, selectItem }) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const selectedItem = panelRef.current?.children[selectedIndex];
    selectedItem?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);
  return (
    <div className="suggestion-panel" ref={panelRef}>
      {items.map((item, index) => (
        <SuggestionItem
          id={index}
          key={index}
          item={item}
          isSelected={index === selectedIndex}
          onSelect={() => selectItem(index)}
        />
      ))}
    </div>
  );
};
