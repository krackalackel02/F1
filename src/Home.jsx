import React from "react";
import styles from "./Home.module.css";
export default function Home() {
	return (
		<div className={styles["home-content"]}>
			<h1>Welcome to Pitstop Portal</h1>
			<p>
      <strong>Pitstop Portal</strong> is your comprehensive resource for all things Formula 1
				racing. Get detailed information about drivers, circuits, races, and
				more from your favorite season of F1, all at your fingertips.
			</p>
			<p>Explore our features:</p>
			<ul>
				<li>
					<strong>Drivers:</strong> Get a closer look at the competitors. Learn
					about their career, nationality, date of birth, and see their profile
					image.
				</li>
				<li>
					<strong>Circuits:</strong> Delve into the intricacies of each race
					track from every season. Find out about their length, record lap
					times, their location, and other crucial details that make each
					circuit unique.
				</li>
				<li>
					<strong>Races:</strong> Review each race from your chosen season. See
					the date it was held, the winner, the pole sitter, and more
					interesting data about each Grand Prix.
				</li>
				<li>
					<strong>Results:</strong> Examine the outcome of each race in detail.
					Review the final positions, lap times, and points won by each driver.
				</li>
			</ul>
			<p>
				We always love to hear from our users. If you have any questions,
				suggestions, or just want to share your F1 stories, don't hesitate to
				get in touch through our <strong>Contact Us</strong> page.
			</p>
			<p>
				Buckle up and start your engines for a thrilling ride into the world of
				Formula 1 with Pitstop Portal.
			</p>
		</div>
	);
}
