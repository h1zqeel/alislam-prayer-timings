"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
	const [dark, setDark] = useState(false);

	useEffect(() => {
		if (dark) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, [dark]);

	return (
		<button
			className="absolute top-4 right-4 p-2 text-sm rounded-md bg-gray-200 dark:bg-gray-700"
			onClick={() => setDark((prev) => !prev)}
		>
			{dark ? "🌙 Dark" : "☀️ Light"}
		</button>
	);
}
