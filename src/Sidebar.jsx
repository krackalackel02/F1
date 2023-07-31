import React from "react";
import "./Sidebar.css";
import { TABS } from "./App.jsx";

export default function Sidebar({ setActiveTab }) {
  return (
    <div className="sidebar-wrapper">
      <h3>Check out below!</h3>
      <div className="sidebar-list-container">
        <ul className="sidebar-list">
          {TABS.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}>
              {tab}
            </button>
          ))}
        </ul>
      </div>
    </div>
  );
}
