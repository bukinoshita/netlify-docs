'use strict'

import React from 'react'

const Sidebar = ({ items }) => (
  <aside className="sidebar">
    <ul className="menu">
      {items.map(item => {
        const id = '#' + item.toLowerCase().replace('-', '')
        const name = item
          .split('-')
          .join(' ')
          .replace(
            /\w\S*/g,
            txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
          )

        return (
          <li className="menu-item" key={item}>
            <a className="menu__link" href={id}>
              {name}
            </a>
          </li>
        )
      })}
    </ul>
  </aside>
)

export default Sidebar
