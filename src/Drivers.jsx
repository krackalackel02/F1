import styles from "./Drivers.module.css";
import React, { useEffect, useState } from "react";
import Loading from "./Loading.jsx";
import Placeholder from "./assets/placeholder_driver.svg";
import CircleWithText from "./CircleWithText";
import searchImage from "./seachImage.js";

export default function Drivers({
	activeTab,
	setActiveTab,
	activeRace,
	setActiveRace,
	season,
	setSeason,
	loading,
	setLoading,
}) {
	const [driverTable, setDriverTable] = useState(null);
	const [drivers, setDrivers] = useState([]);

	useEffect(() => {
		setLoading(true);
		const URL = `https://ergast.com/api/f1/${season}/drivers.json`;
		fetch(URL, {
			mode: "cors",
		})
			.then((result) => result.json())
			.then((data) => {
				setActiveRace((prev) => ({ ...prev, season }));
				setDriverTable(data["MRData"]["DriverTable"]);
				setLoading(false);
			})
			.catch((err) => {
				console.error(err);
				setLoading(false);
			});
	}, [season]);

	useEffect(() => {
		if (!driverTable) return;
		setLoading(true);
		const fetchRaceData = async () => {
			const driverList = await Promise.all(
				driverTable["Drivers"].map(async (driver) => {
					const img = await searchImage(driver["url"], Placeholder, false);
					console.log({
						...driver,
						name: `${driver["givenName"]} ${driver["familyName"]}`,
						img: img,
					});
					return {
						...driver,
						name: `${driver["givenName"]} ${driver["familyName"]}`,
						img: img,
					};
				})
			);
			setLoading(false);
			setDrivers(driverList);
		};
		fetchRaceData();
	}, [driverTable]);

	const years = [];
	const currentYear = new Date().getFullYear();
	for (let year = currentYear; year >= 1970; year--) {
		years.push(year);
	}

	return (
		<div>
			<h2 className={styles["driver-header"]}>
				Season:
				<select
					name="season"
					id="season-select"
					onChange={(e) => {
						setSeason(e.target.value);
						setActiveRace({
							...activeRace,
							season: e.target.value,
							seasonLength: drivers[drivers.length - 1].id,
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
					{drivers.map((driver) => (
						<div key={driver.name} className={styles["driver-card"]}>
							<div className={styles["driver-card-content"]}>
								<h3 className={styles["driver-card-title"]}>
									<div className={styles["Driver-Profile"]}>
										<img src={driver.img} alt="" />
									</div>
									<span>
										{driver.name} [{driver.code && driver.code}]
									</span>
								</h3>
								<div className={styles["driver-card-details"]}>
									<div>DOB - {driver.dateOfBirth}</div>
									<div>Nationality - {driver.nationality}</div>
									{driver.permanentNumber && (
										<div>Driver Number - {driver.permanentNumber}</div>
									)}
									<div>
										Bio found <a href={driver.url}>here</a>
									</div>
									{/* {Object.entries(driver).map(([eventKey, eventValue]) => {
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
