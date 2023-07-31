import React from 'react'
import "./Sidebar.css"
export default function Sidebar() {
  return (
    <div className='sidebar-wrapper'>
      <h3>Check out below!</h3>
      <div className="sidebar-list-container">
        <ul className='sidebar-list'>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
          <li>Item 4</li>
          <li>Item 5</li>
        </ul>
      </div>
    </div>
  )
}
