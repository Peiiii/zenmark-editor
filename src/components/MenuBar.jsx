import '../css/MenuBar.scss'

import React, { Fragment } from 'react'

import MenuItem from './MenuItem'
import { Actions } from "../actions";

export default ({ editor }) => {
  const items = [
    Actions.Bold,
    Actions.Italic,
    Actions.Strikethrough,
    Actions.CodeView,
    Actions.MarkPenLine,
    Actions.Divider,
    Actions.H1,
    Actions.H2,
    Actions.Paragraph,
    Actions.ListUnordered,
    Actions.ListOrdered,
    Actions.ListCheck2,
    Actions.CodeBoxLine,
    Actions.Divider,
    Actions.DoubleQuotes1,
    Actions.Separator,
    Actions.Divider,
    Actions.TextWrap,
    Actions.AlignLeft,
    Actions.AlignCenter,
    Actions.AlignRight,
    Actions.AlignJustify,
    Actions.AddImage,
    Actions.FormatClear,
    Actions.Divider,
    Actions.GoBackLine,
    Actions.GoForwardLine,
    Actions.Divider,
    Actions.SaveFile,
    Actions.Invite,
  ]

  return (
    <div className="editor__header">
      {items.map((item, index) => (
        <Fragment key={index}>
          {item.type === 'divider' ? <div className="divider" /> : <MenuItem editor={editor} {...item} />}
        </Fragment>
      ))}
    </div>
  )
}
