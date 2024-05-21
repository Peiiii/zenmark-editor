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
  return (
    <div className="suggestion-panel">
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
