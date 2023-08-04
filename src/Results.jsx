import React, { useState, useEffect, useRef } from "react";
import PlaceholderTrack from "./assets/placeholder_track.jpg";
import PlaceholderConstructor from "./assets/placeholder_constructor.svg";
import PlaceholderDriver from "./assets/placeholder_driver.svg";
import { searchImage } from "./Races.jsx";
import styles from "./Results.module.css";
import Loading from "./Loading.jsx";

async function findWinningDriver(dataCurrent) {
	const data = dataCurrent["MRData"];
	const numDrivers = data["total"];
	const raceTable = data["RaceTable"];
	const Races = raceTable["Races"];
	if (!Races.length > 0) return {};
	let Circuit = Races[0]["Circuit"];
	let { Driver, Constructor, grid, Time } = Races[0]["Results"][0];
	const DriverImg = await searchImage(Driver.url, PlaceholderDriver);
	const ConstructorImg = await searchImage(
		Constructor.url,
		PlaceholderConstructor
	);
	const CircuitImg = await searchImage(Circuit.url, PlaceholderTrack);
	return {
		Driver: { ...Driver, img: DriverImg },
		Constructor: { ...Constructor, img: ConstructorImg },
		grid,
		Time,
		Circuit: { ...Circuit, img: CircuitImg },
	};
}

async function getRoundLength(season, setActiveRace, activeRaceRef, round) {
	try {
		const URL = `https://ergast.com/api/f1/${activeRaceRef.current.season}.json`;
		const data = await fetch(URL, {
			mode: "cors",
		});
		const jsonData = await data.json();
		setActiveRace({
			...activeRaceRef.current,
			seasonLength: jsonData["MRData"]["total"],
		});
	} catch (error) {
		console.error("Error fetching data:", error);
	}
}

export default function Results({
	season,
	setSeason,
	activeRace,
	setActiveRace,
	activeTab,
	setActiveTab,
	loading,
	setLoading,
}) {
	const [round, setRound] = useState(1);
	const [result, setResult] = useState(null);
	const activeRaceRef = useRef(activeRace);
	const prevSeason = useRef(activeRace.season);
	const prevRound = useRef(activeRace.round);

	useEffect(() => {
		activeRaceRef.current = activeRace;
		if (
			activeRace.season !== prevSeason.current ||
			activeRace.round !== prevRound.current
		) {
			setLoading(true);
			getRoundLength(
				activeRace.season,
				setActiveRace,
				activeRaceRef,
				activeRace.round
			)
				.then(() => {
					fetch(
						`https://ergast.com/api/f1/${activeRace.season}/${activeRace.round}/results.json`,
						{ mode: "cors" }
					)
						.then((res) => res.json())
						.then((result) => {
							findWinningDriver(result).then((RESULT) => {
								setResult(JSON.stringify(RESULT, null, 2));
								setResult(RESULT);
								setLoading(false);
							});

							prevSeason.current = activeRace.season;
							prevRound.current = activeRace.round;
						})
						.catch((err) => {
							console.error(err);
							setLoading(false);
						});
				})
				.catch((error) => console.error("Error setting season length:", error));
		}
	}, [activeRace]);

	useEffect(() => {
		activeRaceRef.current = activeRace;
		getRoundLength(activeRace.season, setActiveRace, activeRaceRef).catch(
			(error) => console.error("Error setting season length:", error)
		);
		fetch(
			`https://ergast.com/api/f1/${activeRace.season}/${activeRace.round}/results.json`,
			{ mode: "cors" }
		)
			.then((res) => res.json())
			.then((result) => {
				findWinningDriver(result).then((RESULT) => {
					setResult(JSON.stringify(RESULT, null, 2));
					setResult(RESULT);
					setLoading(false);
				});
				prevSeason.current = activeRace.season;
				prevRound.current = activeRace.round;
			})
			.catch((err) => {
				console.error(err);
			});

		return () => {
			setLoading(true);
		};
	}, [activeTab]);

	const years = [];
	const currentYear = new Date().getFullYear();
	for (let year = currentYear; year >= 1970; year--) {
		years.push(year);
	}

	const rounds = [];
	for (let index = 0; index < activeRace.seasonLength; index++) {
		rounds.push(index + 1);
	}

	return (
		<div>
			<h2 className={styles["results-header"]}>
				<span>Season:</span>
				<select
					name="season"
					id="season-select"
					onChange={(e) => {
						setSeason(e.target.value);
						setActiveRace({
							...activeRace,
							season: e.target.value,
							round: round,
							seasonLength: activeRace.seasonLength,
						});
					}}
					value={activeRace.season}
				>
					{years.map((year) => (
						<option key={year} value={year}>
							{year}
						</option>
					))}
				</select>
				<span>Round:</span>
				<select
					name="round"
					id="round-select"
					onChange={(e) => {
						setActiveRace({
							...activeRace,
							season: season,
							round: e.target.value,
							seasonLength: activeRace.seasonLength,
						});
						setRound(e.target.value);
					}}
					value={activeRace.round}
				>
					{rounds.map((roundNum) => (
						<option key={roundNum} value={roundNum}>
							{roundNum}
						</option>
					))}
				</select>
			</h2>
			<div>
				{!loading ? (
					result && Object.keys(result).length > 0 ? (
						<>
							<pre>{JSON.stringify(result, null, 2)}</pre>
							<div className={styles["winner-card"]}>
								<img
									src={result.Circuit.img}
									alt=""
									className={styles["Circuit"]}
								/>
								<div className={styles["Driver"]}>
									<img src={result.Driver.img} alt="" />
									<div>
										{result.Driver.givenName + " " + result.Driver.familyName}
									</div>
								</div>
								<div className={styles["Constructor"]}>
									<img src={result.Constructor.img} alt="" />
									<div>{result.Constructor.name}</div>
								</div>
							</div>
						</>
					) : (
						<pre>Stay tuned for results in the future!</pre>
					)
				) : (
					<Loading />
				)}
			</div>
		</div>
	);
}
