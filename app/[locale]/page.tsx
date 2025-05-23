"use client";

import PrayerTimesCard from "@/components/PrayerTimesCard";
import { useEffect, useState } from "react";

export default function Locale() {
	const [isRendered, setIsRendered] = useState(false);

	useEffect(() => {
		setIsRendered(true);
	}, []);
	return (
		<main className="flex items-center justify-center min-h-screen bg-blue-100 dark:bg-gray-800 transition-colors px-4">
			{isRendered && <PrayerTimesCard />}
		</main>
	);
}
