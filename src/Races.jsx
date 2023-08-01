import React, { useEffect, useState } from "react";
import Loading from "./assets/loading.svg";
import CircleWithText from "./CircleWithText";
import "./Races.css";

async function searchImage(searchTerm) {
	try {
		const response = await fetch(
			`https://source.unsplash.com/featured/?${encodeURIComponent(searchTerm)}`, {
				mode: 'cors'
			  }
		);

		if (response.ok) {
			return response.url; // The URL of the first matching image
		} else {
			return "https://d3cm515ijfiu6w.cloudfront.net/wp-content/uploads/2018/12/04132754/Sergio_Perez11111111111.jpeg"; // If no image is found for the search term or there's an error
		}
	} catch (error) {
		console.error("Error fetching image from Unsplash Source:", error);
		return "https://d3cm515ijfiu6w.cloudfront.net/wp-content/uploads/2018/12/04132754/Sergio_Perez11111111111.jpeg";
	}
}

const formatDate = (dateString) => {
	const date = new Date(dateString);
	const options = { day: "numeric", month: "long", year: "numeric" };
	const formattedDate = date.toLocaleDateString(undefined, options);
	return formattedDate;
};

export default function Races({ activeTab }) {
	const [raceTable, setRaceTable] = useState(null);
	const [races, setRaces] = useState([]);
	const [season, setSeason] = useState("current");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const URL = `http://ergast.com/api/f1/${season}.json`;
		fetch(URL, {
			mode: 'cors'
		  })
			.then((result) => {
				return result.json();
			})
			.then((data) => {
				setRaceTable(data["MRData"]["RaceTable"]);
			})
			.catch((err) => {
				console.error(err);
			});
		return () => {
			setLoading(true);
		};
	}, [season]);

	useEffect(() => {
		if (!raceTable) return;

		const fetchRaceData = async () => {
			const raceList = await Promise.all(
				raceTable["Races"].map(async (race) => {
					const img = await searchImage(
						race["raceName"].match(/([A-Za-z]*) Grand Prix/)[1]
					);
					let isAfterTimeProp = false;
					const events = Object.entries(race).reduce((acc, [key, value]) => {
						if (key === "time") {
							isAfterTimeProp = true;
							return acc;
						}
						if (isAfterTimeProp) {
							return { ...acc, [key]: value };
						}
						return acc;
					}, {});

					return {
						id: race.round,
						name: race["raceName"],
						img: img,
						circuit: race["Circuit"]["circuitName"],
						events: {
							...events,
							Race: {
								date: race["date"],
								time: race["time"],
							},
						},
					};
				})
			);
			setLoading(false);
			setRaces(raceList);
		};

		fetchRaceData();
		return () => {
			setLoading(true);
		};
	}, [raceTable]);

	// Generate an array of years from the current year to 1970
	const years = [];
	const currentYear = new Date().getFullYear();
	for (let year = currentYear; year >= 1970; year--) {
		years.push(year);
	}
	return (
		<div>
			<h2>Races</h2>
			<select
				name="season"
				id="season-select"
				onChange={(e) => setSeason(e.target.value)}
				value={season}
			>
				{years.map((year) => (
					<option key={year} value={year}>
						{year}
					</option>
				))}
			</select>
			{!loading ? (
				<div className="card-list">
					{races.map((race) => (
						<div key={race.id} className="race-card">
							<img src={race.img} alt="" className="race-card-image" />
							<div className="race-card-content">
								<h3>
									<CircleWithText raceId={race.id} />

									<span>{race.name}</span>
								</h3>
								<h4>{race.circuit}</h4>
								<div>
									{/* Iterate through each event and display its details */}
									{Object.entries(race.events).map(([eventKey, eventValue]) => {
										// Use regular expression to split eventKey into words and add spaces
										const formattedEventKey = eventKey
											.replace(/([A-Z])/g, " $1")
											.trim();
										// Parse the time using Date object and format it
										const formattedTime = new Date(
											`1970-01-01T${eventValue.time}`
										).toLocaleTimeString([], {
											hour: "numeric",
											minute: "2-digit",
											hour12: true,
											timeZoneName: "short", // Include the time zone abbreviation
										});
										// Format the date using the helper function
										const formattedDate = formatDate(eventValue.date);
										return (
											<div key={eventKey}>
												<h5>{formattedEventKey}</h5>
												<p>Date: {formattedDate}</p>
												{formattedTime == "Invalid Date" ? null : (
													<p>Time: {formattedTime}</p>
												)}
											</div>
										);
									})}
								</div>
							</div>
						</div>
					))}
				</div>
			) : (
				<div className="loading-wrapper">
					<img src={Loading} alt="Loading..." className="rotating" />
				</div>
			)}
		</div>
	);
}
