import React, { useState, useEffect, useRef } from "react";
import PlaceholderTrack from "./assets/placeholder_track.jpg";
import PlaceholderConstructor from "./assets/placeholder_constructor.svg";
import PlaceholderDriver from "./assets/placeholder_driver.svg";
// import { searchImage } from "./Races.jsx";
import searchImage from "./seachImage.js";
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
	const DriverImg = await searchImage(Driver.url, PlaceholderDriver, false);
	const ConstructorImg = await searchImage(
		Constructor.url,
		PlaceholderConstructor,
		false
	);
	const CircuitImg = await searchImage(Circuit.url, PlaceholderTrack, true);
	return {
		Driver: { ...Driver, img: DriverImg },
		Constructor: { ...Constructor, img: ConstructorImg },
		grid,
		Time,
		Circuit: { ...Circuit, img: CircuitImg },
	};
}
async function findPodiumDrivers(dataCurrent, setTrackImg) {
	const data = dataCurrent["MRData"];
	const numDrivers = data["total"];
	const raceTable = data["RaceTable"];
	const Races = raceTable["Races"];
	if (!Races.length > 0) return {};
	let Circuit = Races[0]["Circuit"];
	let [Gold, Silver, Bronze] = Races[0]["Results"].slice(0, 3);
	const CircuitImg = await searchImage(Circuit.url, PlaceholderTrack, true);
	setTrackImg(CircuitImg);
	let GoldDriverImg = await searchImage(
		Gold.Driver.url,
		PlaceholderDriver,
		false
	);
	let SilverDriverImg = await searchImage(
		Silver.Driver.url,
		PlaceholderDriver,
		false
	);
	let BronzeDriverImg = await searchImage(
		Bronze.Driver.url,
		PlaceholderDriver,
		false
	);
	let GoldConstructorImg = await searchImage(
		Gold.Constructor.url,
		PlaceholderConstructor,
		false
	);
	let SilverConstructorImg = await searchImage(
		Silver.Constructor.url,
		PlaceholderConstructor,
		false
	);
	let BronzeConstructorImg = await searchImage(
		Bronze.Constructor.url,
		PlaceholderConstructor,
		false
	);
	return [
		{
			...Gold,
			Driver: { ...Gold.Driver, img: GoldDriverImg },
			Constructor: { ...Gold.Constructor, img: GoldConstructorImg },
			Circuit: { ...Gold.Circuit, img: CircuitImg },
		},
		{
			...Silver,
			Driver: { ...Silver.Driver, img: SilverDriverImg },
			Constructor: { ...Silver.Constructor, img: SilverConstructorImg },
			Circuit: { ...Gold.Circuit, img: CircuitImg },
		},
		{
			...Bronze,
			Driver: { ...Bronze.Driver, img: BronzeDriverImg },
			Constructor: { ...Bronze.Constructor, img: BronzeConstructorImg },
			Circuit: { ...Gold.Circuit, img: CircuitImg },
		},
	];
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
	const [trackImg, setTrackImg] = useState(
		"//upload.wikimedia.org/wikipedia/commons/thumb/2/29/Bahrain_International_Circuit--Grand_Prix_Layout.svg/250px-Bahrain_International_Circuit--Grand_Prix_Layout.svg.png"
	);
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
							findPodiumDrivers(result, setTrackImg)
								.then((result) => {
									setResult(result);
									prevSeason.current = activeRace.season;
									prevRound.current = activeRace.round;
									setLoading(false);
								})
								.catch((err) => {
									console.error(err);
									setLoading(false);
								});
							// findWinningDriver(result).then((RESULT) => {
							// 	setResult(JSON.stringify(RESULT, null, 2));
							// 	setResult(RESULT);
							// 	setLoading(false);
							// 	prevSeason.current = activeRace.season;
							// 	prevRound.current = activeRace.round;
							// });
						})
						.catch((err) => {
							console.error(err);
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
				findPodiumDrivers(result, setTrackImg)
					.then((result) => {
						setResult(result);
						prevSeason.current = activeRace.season;
						prevRound.current = activeRace.round;
						setLoading(false);
					})
					.catch((err) => {
						console.error(err);
						setLoading(false);
					});
				// findWinningDriver(result).then((RESULT) => {
				// 	setResult(JSON.stringify(RESULT, null, 2));
				// 	setResult(RESULT);
				// 	setLoading(false);
				// });
				// prevSeason.current = activeRace.season;
				// prevRound.current = activeRace.round;
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
							{/* <pre>{JSON.stringify(result, null, 2)}</pre> */}
							<div className={styles["Track"]}>
								<img src={trackImg} alt="" className={styles["Circuit"]} />
								{result.map((winner) => {
									return (
										<div
											className={styles["winner-card"]}
											key={winner.Driver.url}
										>
											<div className={styles["Winner"]}>
												<img src={winner.Constructor.img} alt="" />
												<div className={styles["Driver"]}>
													<div className={styles["Driver-Profile"]}>
														<img src={winner.Driver.img} alt="" />
													</div>
													<div className={styles["Driver-Content"]}>
														<div className={styles["winner-type"]}>Driver:</div>
														<div className={styles["winner-name"]}>
															{winner.Driver.givenName +
																" " +
																winner.Driver.familyName}
														</div>
														<div className={styles["Constructor-Content"]}>
															<div className={styles["winner-type"]}>
																Constructor:
															</div>
															<div className={styles["winner-name"]}>
																{winner.Constructor.name}
															</div>
														</div>
													</div>
												</div>
											</div>
											<div className={styles["Data"]}>
												<div className={styles["Data-Content"]}>
													<div>
														<div className={styles["winner-type"]}>Time:</div>
														<div className={styles["winner-name"]}>
															{winner.Time.time}
														</div>
													</div>
													<div>
														<div className={styles["winner-type"]}>
															Starting Grid:
														</div>
														<div className={styles["winner-name"]}>
															{winner.grid}
														</div>
													</div>
												</div>
											</div>
										</div>
									);
								})}
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
