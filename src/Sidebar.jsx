import React from "react";
import { TABS } from "./App.jsx";
import styles from "./Sidebar.module.css";

export default function Sidebar({ activeTab, setActiveTab }) {
	return (
		<>
			<div className={`${styles["sidebar-wrapper"]} 	`}>
				<h3 >Check out below!</h3>
				<div className={styles["sidebar-list-container"]}>
					<ul
						className={`${styles["sidebar-list"]} justify-content-around d-flex flex-column gap-2`}
					>
						{TABS.map((tab) => (
							<button
								key={tab}
								onClick={() => {
									setActiveTab(tab);
								}}
								className={`btn btn-primary ${
									activeTab === tab ? "active" : ""
								}`}
							>
								{tab}
							</button>
						))}
					</ul>
				</div>
			</div>
		</>
	);
}
