import '../css/MenuItem.scss';

import React from 'react';
import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg';

export default ({
  icon, title, action, isActive = null,editor,
}:any) => (
  <button
    className={`menu-item${isActive && isActive(editor) ? ' is-active' : ''}`}
    onClick={()=>{action(editor)}}
    title={title}
  >
    <svg className="remix">
      <use xlinkHref={`${remixiconUrl}#ri-${icon}`} />
    </svg>
  </button>
)
