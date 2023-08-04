import React from "react";
import { TABS } from "./App.jsx";
import styles from "./Sidebar.module.css";

export default function Sidebar({ setActiveTab }) {
	return (
		<div className={styles["sidebar-wrapper"]}>
			<h3>Check out below!</h3>
			<div className={styles["sidebar-list-container"]}>
				<ul className={styles["sidebar-list"]}>
					{TABS.map((tab) => (
						<button key={tab} onClick={() => setActiveTab(tab)}>
							{tab}
						</button>
					))}
				</ul>
			</div>
		</div>
	);
}
