import React, { useEffect, useState } from "react";
import Loading from "./Loading.jsx";
import Placeholder from "./assets/placeholder_track.jpg";
import CircleWithText from "./CircleWithText";
import styles from "./Races.module.css";
import searchImage from "./seachImage.js";
//  export async function searchImage(searchTerm,fallback) {
// 	try {
// 		const wikipedia = searchTerm;
// 		const wikipediaTitle = wikipedia.match(/\/wiki\/(.+)/)[1];
// 		const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
// 			wikipediaTitle
// 		)}&prop=pageimages&format=json&pithumbsize=1000&origin=*`;
// 		const link = await fetch(apiUrl, { mode: "cors" });
// 		const data = await link.json();
// 		const pageData = data.query.pages;
// 		const pageId = Object.keys(pageData)[0];
// 		const imageUrl = pageData[pageId].thumbnail.source;
// 		if (!imageUrl) return fallback;
// 		return imageUrl;
// 	} catch (error) {
// 		return fallback;
// 	}
// }

const formatDate = (dateString) => {
	const date = new Date(dateString);
	const options = { day: "numeric", month: "long", year: "numeric" };
	const formattedDate = date.toLocaleDateString(undefined, options);
	return formattedDate;
};

export default function Races({
	activeTab,
	setActiveTab,
	activeRace,
	setActiveRace,
	season,
	setSeason,
	loading,
	setLoading,
}) {
	const [raceTable, setRaceTable] = useState(null);
	const [races, setRaces] = useState([]);

	useEffect(() => {
		const URL = `https://ergast.com/api/f1/${season}.json`;
		fetch(URL, {
			mode: "cors",
		})
			.then((result) => {
				return result.json();
			})
			.then((data) => {
				setActiveRace({
					...activeRace,
					season: season,
					seasonLength: data["MRData"]["total"],
				});
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
					const img = await searchImage(race["Circuit"]["url"],Placeholder,true);
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

	const years = [];
	const currentYear = new Date().getFullYear();
	for (let year = currentYear; year >= 1970; year--) {
		years.push(year);
	}
	return (
		<div>
			<h2 className={styles["race-header"]}>
				Season:
				<select
					name="season"
					id="season-select"
					onChange={(e) => {
						setSeason(e.target.value);
						setActiveRace({
							...activeRace,
							season: e.target.value,
							seasonLength: races[races.length - 1].id,
						}); // Fix this line to use e.target.value for season
					}}
					value={season}
				>
					{years.map((year) => (
						<option key={year} value={year}>
							{year}
						</option>
					))}
				</select>
			</h2>
			{!loading ? (
				<div className={styles["card-list"]}>
					{races.map((race) => (
						<div key={race.id} className={styles["race-card"]}>
							<img src={race.img} alt="" className={styles["race-card-image"]} />
							<div className={styles["race-card-content"]}>
								<h3 className={styles["race-card-title"]}>
									<CircleWithText raceId={race.id} />

									<span>{race.name}</span>
								</h3>
								<h4>
									Track: <div>{race.circuit}</div>
								</h4>
								<div className={styles["race-card-details"]}>
									{/* Iterate through each event and display its details */}
									{Object.entries(race.events).map(([eventKey, eventValue]) => {
										const formattedEventKey = eventKey
											.replace(/([A-Z])/g, " $1")
											.trim();

										const formattedTime = new Date(
											`1970-01-01T${eventValue.time}`
										).toLocaleTimeString([], {
											hour: "numeric",
											minute: "2-digit",
											hour12: true,
											timeZoneName: "short",
										});

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
								<div className={styles["results"]}>
									<button
									className="btn btn-primary"
										onClick={() => {
											setActiveRace({
												...activeRace,
												season: season,
												round: race.id,
												img: race.img,
												track: race.circuit,
												prix: race.name,
												seasonLength: races[races.length - 1].id,
											});
											setActiveTab("results");
										}}
									>
										go to Results
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			) : (
				<Loading />
			)}
		</div>
	);
}
