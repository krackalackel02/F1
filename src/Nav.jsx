import React from "react";
import styles from "./Nav.module.css";

export default function Nav() {
	return (
		<div className={styles["nav-list-container"]}>
			<ul className={styles["nav-list"]}>
				<li>Home</li>
				<li>About</li>
				<li>Contact Us</li>
			</ul>
		</div>
	);
}
