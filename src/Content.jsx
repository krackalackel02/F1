import React, { useEffect, useState } from "react";
import Home from "./Home.jsx";
import Drivers from "./Drivers.jsx";
import Circuits from "./Circuits.jsx";
import Races from "./Races.jsx";
import Results from "./Results.jsx";
import Contact from "./Contact.jsx";
import Loading from "./assets/loading.svg";
import "./Content.css";

export default function Content({
	activeTab,
	setActiveTab,
	activeRace,
	setActiveRace,
}) {
	const [season, setSeason] = useState("2023");
	const [loading, setLoading] = useState(true);

	return (
		<div className="content-wrapper">
			{(() => {
				switch (activeTab) {
					case "home":
						return <Home />;

					case "drivers":
						return <Drivers />;

					case "circuits":
						return <Circuits />;

					case "races":
						return (
							<Races
								season={season}
								setSeason={setSeason}
								activeTab={activeTab}
								setActiveTab={setActiveTab}
								setActiveRace={setActiveRace}
								loading={loading}
								setLoading={setLoading}
							/>
						);
					case "results":
						return (
							<Results
								loading={loading}
								setLoading={setLoading}
								season={activeRace.season}
								setSeason={setSeason}
								activeRace={activeRace}
								setActiveRace={setActiveRace}
								activeTab={activeTab}
								setActiveTab={setActiveTab}
							/>
						);
					case "contact us":
						return <Contact />;
					default:
						return activeTab;
				}
			})()}
		</div>
	);
}
