import React, { Fragment } from "react";

import MenuItem from "./MenuItem";
import { Actions } from "../actions/editor";
import {FcCollapse} from "react-icons/fc"

export default ({ editor, onCollapse }: { editor: any; onCollapse?: () => void }) => {
  const items: any[] = [
    Actions.Bold,
    Actions.Italic,
    Actions.Strikethrough,
    Actions.CodeView,
    // Actions.Highlight,
    Actions.Divider,
    Actions.H1,
    Actions.H2,
    // Actions.Paragraph,
    Actions.BulletList,
    Actions.OrderedList,
    Actions.TaskList,
    Actions.CodeBlock,
    Actions.MermaidBlock,
    Actions.InsertTable,
    Actions.Divider,
    Actions.DoubleQuotes1,
    Actions.Separator,
    Actions.Divider,
    // Actions.TextWrap,
    // Actions.AlignLeft,
    // Actions.AlignCenter,
    // Actions.AlignRight,
    // Actions.AlignJustify,
    Actions.AddImage,
    Actions.Iframe,
    Actions.FormatClear,
    // Actions.Divider,
    // Actions.GoBackLine,
    // Actions.GoForwardLine,
    Actions.Divider,
    // Actions.Invite,
  ];

  return (
    <div className="zenmark-editor__header zenmark-toolbar">
      <div className="zenmark-editor__header-left">
        {" "}
        {items.map((item, index) => (
          <Fragment key={index}>
            {item.type === "divider" ? (
              <div className="zenmark-divider" />
            ) : (
              <MenuItem editor={editor} {...item} />
            )}
          </Fragment>
        ))}
      </div>
      <div className="zenmark-editor__header-middle"/>
      <div className="zenmark-editor__header-right">
        <MenuItem name="collapseMenuBar" editor={editor} title="collapse" icon={FcCollapse} action={()=>{
          onCollapse?.();
        }}/>
      </div>
    </div>
  );
};
