import "../css/FloatingMenu.scss";
import {  FloatingMenu } from '@tiptap/react'
import React, { Fragment } from 'react'

import MenuItem from './MenuItem'
import { Actions } from "../actions/editor";

export default ({ editor }) => {
  const items = [
    Actions.Bold,
    Actions.Italic,
    Actions.Strikethrough,
  ]

  return (
    <FloatingMenu className="floating-menu" tippyOptions={{ duration: 100 }}  editor={editor}>
     {items.map((item:any, index) => (
        <Fragment key={index}>
          {item.type === 'divider' ? <div className="divider" /> : <MenuItem editor={editor} {...item} />}
        </Fragment>
      ))}
  </FloatingMenu>
  )
}
