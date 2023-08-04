import React from 'react'
import Nav from './Nav.jsx'
import Logo from './assets/steering-wheel.svg'
import styles from "./Header.module.css";


export default function Header() {
  return (
    <div>
      <div className={styles.title}>
        <img src={Logo} alt="Logo" />
        <h1>Pitstop Portal</h1>
      </div>
    </div>
  )
}
