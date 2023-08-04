import React from "react";
import styles from "./Loading.module.css";
import loading from "./assets/loading.svg";

export default function Loading() {
	return (
		<div className={styles["loading-wrapper"]}>
			<img src={loading} alt="Loading..." className={styles["rotating"]} />
		</div>
	);
}
