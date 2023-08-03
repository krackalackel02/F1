import React, { useState, useEffect, useRef } from "react";
import Loading from "./assets/loading.svg";

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
			// Perform the API call only if season or round has changed
			setLoading(true); // Set loading to true before making API calls
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
							setResult(JSON.stringify(result));
							setLoading(false); // Set loading to false once data is fetched and processed
							prevSeason.current = activeRace.season;
							prevRound.current = activeRace.round;
						})
						.catch((err) => {
							console.error(err);
							setLoading(false); // Set loading to false in case of error as well
						});
				})
				.catch((error) => console.error("Error setting season length:", error));

		}
	}, [activeRace]);
	useEffect(() => {
		activeRaceRef.current = activeRace;

		// Perform the API call only if season or round has changed
		getRoundLength(activeRace.season, setActiveRace, activeRaceRef).catch(
			(error) => console.error("Error setting season length:", error)
		);
		fetch(
			`https://ergast.com/api/f1/${activeRace.season}/${activeRace.round}/results.json`,
			{ mode: "cors" }
		)
			.then((res) => res.json())
			.then((result) => {
				console.log(activeRace);

				setResult(JSON.stringify(result));
				setLoading(false);
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
			<h2 className="results-header">
				<span>Season:</span>
				<select
					name="season"
					id="season-select"
					onChange={(e) => {
						setSeason(e.target.value);
						setActiveRace({
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
					result
				) : (
					<div className="loading-wrapper">
						<img src={Loading} alt="Loading..." className="rotating" />
					</div>
				)}
			</div>
		</div>
	);
}
