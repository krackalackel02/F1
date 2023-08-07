import React, { useEffect, useState } from "react";
import styles from "./Circuits.module.css";
import Loading from "./Loading.jsx";
import Placeholder from "./assets/placeholder_track.jpg";
import CircleWithText from "./CircleWithText";
import searchImage from "./seachImage.js";

export default function Circuits({
	activeTab,
	setActiveTab,
	activeRace,
	setActiveRace,
	season,
	setSeason,
	loading,
	setLoading,
}) {
	const [circuitTable, setCircuitTable] = useState(null);
	const [circuits, setCircuits] = useState([]);

	useEffect(() => {
		setLoading(true);
		const URL = `https://ergast.com/api/f1/${season}/circuits.json`;
		fetch(URL, {
			mode: "cors",
		})
			.then((result) => result.json())
			.then((data) => {
				setActiveRace((prev) => ({ ...prev, season }));
				setCircuitTable(data["MRData"]["CircuitTable"]);
				setLoading(false);
			})
			.catch((err) => {
				console.error(err);
				setLoading(false);
			});
	}, [season]);

	useEffect(() => {
		if (!circuitTable) return;
		setLoading(true);
		const fetchRaceData = async () => {
			const driverList = await Promise.all(
				circuitTable["Circuits"].map(async (circuit) => {
					const img = await searchImage(circuit["url"], Placeholder, true);
					console.log({
						...circuit,
						img: img,
					});
					return {
						...circuit,
						img: img,
					};
				})
			);
			setLoading(false);
			setCircuits(driverList);
		};
		fetchRaceData();
	}, [circuitTable]);

	const years = [];
	const currentYear = new Date().getFullYear();
	for (let year = currentYear; year >= 1970; year--) {
		years.push(year);
	}

	return (
		<div>
			<h2 className={styles["circuit-header"]}>
				Season:
				<select
					name="season"
					id="season-select"
					onChange={(e) => {
						setSeason(e.target.value);
						setActiveRace({
							...activeRace,
							season: e.target.value,
							seasonLength: circuits[circuits.length - 1].id,
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
					{circuits.map((circuit) => (
						<div key={circuit.circuitId} className={styles["circuit-card"]}>
										<img src={circuit.img} alt="" />
							<div className={styles["circuit-card-content"]}>
								<h3 className={styles["circuit-card-title"]}>
									<span>{circuit.circuitName}</span>
								</h3>
								<div className={styles["circuit-card-details"]}>
									<div>{`Lat: ${circuit.Location.lat} Long: ${circuit.Location.long}`}</div>
									<div>Locality - {circuit.Location.locality}</div>
									<div>Country - {circuit.Location.country}</div>
									<div>
										Description found <a href={circuit.url}>here</a>
									</div>
									{/* {Object.entries(circuit).map(([eventKey, eventValue]) => {
										const formattedEventKey = eventKey
											.replace(/([A-Z])/g, " $1")
											.trim();

										return (
											<div key={eventKey}>
												<h5>{formattedEventKey}</h5>
												<p>Value: {eventValue}</p>
											</div>
										);
									})} */}
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
