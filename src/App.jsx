import React, { useState, useEffect } from "react";
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
	const [activeRace, setActiveRace] = useState({
		season: 2023,
		round: 1,
		seasonLength: 22,
		track: "Bahrain International Circuit",
		prix: "Bahrain Grand Prix",
		img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Bahrain_International_Circuit--Grand_Prix_Layout.svg/1000px-Bahrain_International_Circuit--Grand_Prix_Layout.svg.png",
	});

	return (
		<div className="container">
			<Header />
			<main>
				<Sidebar setActiveTab={setActiveTab} />
				<Content
					activeTab={activeTab}
					setActiveTab={setActiveTab}
					activeRace={activeRace}
					setActiveRace={setActiveRace}
				/>
			</main>
			<Footer />
		</div>
	);
}
