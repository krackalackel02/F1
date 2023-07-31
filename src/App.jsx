import React, { useState } from "react";
import "./App.css";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import Content from "./Content.jsx";
import Sidebar from "./Sidebar.jsx";

export const TABS = [
	"home",
	"drivers",
	"circuits",
	"races",
	"results",
	"contact us",
];

export default function App() {
	const [activeTab, setActiveTab] = useState("home");
	return (
		<div className="container">
			<Header />
			<main>
				<Sidebar setActiveTab={setActiveTab} />
				<Content activeTab={activeTab} />
			</main>
			<Footer />
		</div>
	);
}
