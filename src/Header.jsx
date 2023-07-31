import React from 'react'
import Nav from './Nav.jsx'
import Logo from './assets/steering-wheel.svg'
import "./Header.css"

export default function Header() {
  return (
    <div>
      <div className='title'>
        <img src={Logo} alt="Logo" />
        <h1>Pitstop Portal</h1>
      </div>
      <Nav/>
    </div>
  )
}
