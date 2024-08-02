import { BubbleMenu, Editor } from "@tiptap/react";
import { css } from "@emotion/css";
import { Fragment, useEffect } from "react";
// import "../css/bubble-menu.scss";

import { Action } from "@/actions/types";
import PopMenu from "@/components/PopMenu";
import { Actions } from "../actions/editor";
import MenuItem from "./MenuItem";

const withId = (item: Action | Action[]) => {
  if (Array.isArray(item)) {
    return item.map(withId);
  }
  return { ...item, id: item.id || item.name || item.title };
};

export default ({ editor }: { editor: Editor }) => {
  const items: (Action | Action[])[] = [
    Actions.Bold,
    Actions.Italic,
    Actions.Strikethrough,
    // Actions.CodeView,
    // Actions.MarkPenLine,
    // Actions.H1,
    // Actions.H2,
    // Actions.BulletList,
    // Actions.OrderedList,
    // Actions.ListCheck2,
    // Actions.CodeBoxLine,
    // Actions.DoubleQuotes1,
    Actions.EditLink,
    Actions.FormatClear,
    // Actions.Divider,
    // Actions.AlignLeft
    // [Actions.AlignLeft, Actions.AlignCenter, Actions.AlignRight],
    // Actions.AddTableColumnBefore,
    // Actions.AddTableColumnAfter,
    // Actions.AddTableRowBefore,
    // Actions.AddTableRowAfter,
  ].map(withId);

  useEffect(() => {
    const fromNode = editor.view.state.tr.doc.nodeAt(
      editor.state.selection.from
    );
    // console.log("fromNode:", fromNode);
  }, [editor.state.selection]);

  return (
    <BubbleMenu
      className="bubble-menu"
      tippyOptions={{ duration: 100 }}
      editor={editor}
    >
      <div
        className={css`
          display: flex;
        `}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {items.map((item, index) => {
          if (Array.isArray(item)) {
            // return <MenuItemSelect key={index} items={item} editor={editor} />;
            return <PopMenu key={index} items={item} editor={editor} />;
          } else {
            return (
              <Fragment key={index}>
                {item.type === "divider" ? (
                  <div className="divider" />
                ) : (
                  <MenuItem editor={editor} {...item} />
                )}
              </Fragment>
            );
          }
        })}
      </div>
    </BubbleMenu>
  );
};
