import React, { Fragment } from "react";
import "./App.css";
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import Content from './Content.jsx'
import Sidebar from './Sidebar.jsx'

export default function App() {
	return <div className="container">
    <Header/>
    <main>
      <Sidebar/>
      <Content/>
    </main>
    <Footer/>
  </div>;
}
