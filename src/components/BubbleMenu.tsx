import "../css/bubble-menu.scss";
import { BubbleMenu } from '@tiptap/react'
import React, { Fragment, useState } from 'react'

import MenuItem from './MenuItem'
import { Actions } from "../actions";
import MenuItemSelect from "@/components/MenuItemSelect";


export default ({ editor }) => {
  const items = [
    Actions.Bold,
    Actions.Italic,
    Actions.Strikethrough,
    // Actions.CodeView,
    Actions.MarkPenLine,
    Actions.H1,
    Actions.H2,
    Actions.ListUnordered,
    Actions.ListOrdered,
    Actions.ListCheck2,
    Actions.CodeBoxLine,
    Actions.DoubleQuotes1,
    Actions.FormatClear,
    // Actions.Divider,
    // Actions.AlignLeft
    [
      Actions.AlignCenter,
      Actions.AlignLeft,
      Actions.AlignRight,
    ]
  ]

  return (
    <BubbleMenu className="bubble-menu" tippyOptions={{ duration: 100 }} editor={editor}>
     {items.map((item:any, index) => {
      if(Array.isArray(item)){
        return <MenuItemSelect key={index} items={item} editor={editor}/>;
      }else{
        return (
          <Fragment key={index}>
            {item.type === 'divider' ? <div className="divider" /> : <MenuItem editor={editor} {...item} />}
          </Fragment>
        )
      }
     })}
  </BubbleMenu>
  )
}
