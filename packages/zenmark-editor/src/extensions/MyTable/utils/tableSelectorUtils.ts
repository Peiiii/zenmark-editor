export const getSelectorClassName = (type: string): string => {
  const baseClass = "cursor-pointer absolute bg-blue-200 hover:bg-blue-400 transition-opacity";
  
  if (type === "left") return `${baseClass} w-2 h-full -left-3.5 top-0`;
  if (type === "top") return `${baseClass} right-px h-2 left-0 -top-3.5`;
  return `${baseClass} h-3 w-3 -left-4 -top-4 rounded-full`;
};

export const handleDragStart = (
  e: React.DragEvent<HTMLElement>,
  spec: { index?: number; type: string }
) => {
  e.stopPropagation();
  const data = { index: spec?.index, type: spec?.type };
  e.dataTransfer.setData("application/milkdown-table-sort", JSON.stringify(data));
  e.dataTransfer.effectAllowed = "move";
};

export const handleDragOver = (e: React.DragEvent<HTMLElement>) => {
  e.stopPropagation();
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
};

export const handleDrop = (
  e: React.DragEvent<HTMLElement>,
  type: string,
  index: number | undefined
) => {
  if (type === "top-left" || index == null) return;
  
  const data = e.dataTransfer.getData("application/milkdown-table-sort");
  try {
    const { index: sourceIndex, type: sourceType } = JSON.parse(data);
  } catch {
    // ignore data from other source
  }
};

