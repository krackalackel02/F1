import React,{useEffect} from "react";
import Home from "./Home.jsx";
import Drivers from "./Drivers.jsx";
import Circuits from "./Circuits.jsx";
import Races from "./Races.jsx";
import Results from "./Results.jsx";
import Contact from "./Contact.jsx";
import "./Content.css";

export default function Content({ activeTab }) {
	
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
						return <Races />;
					case "results":
						return <Results />;
					case "contact us":
						return <Contact />;
					default:
						return activeTab;
				}
			})()}
		</div>
	);
}
