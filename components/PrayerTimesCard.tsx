"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DateTime } from "luxon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faSun,
	faMoon,
	faCog,
	faGlobe,
	IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { useTranslations, useLocale } from "next-intl";
import { useStorage } from "@/hooks/useStorage";
import { usePrayer } from "@/context/prayer";
import Spinner from "./Spinnner";

export default function PrayerTimesCard() {
	const router = useRouter();
	const { today, loading, error, cords, location, timezone } = usePrayer();
	const [dark, setDark] = useStorage("theme", false);
	const t = useTranslations("PrayerCard");
	const locale = useLocale();
	const isUrdu = useMemo(() => locale === "ur", [locale]);
	const [fontClass, setFontClass] = useState("font-poppins");

	useEffect(() => {
		document.documentElement.classList.toggle("dark", dark);
	}, [dark]);

	useEffect(() => {
		setFontClass(isUrdu ? "font-nastaliq" : "font-poppins");
	}, [isUrdu]);

	if (loading) return <Spinner />;
	if (error || !today)
		return <p className="p-6 text-red-500">{t("error")}</p>;

	const sunriseSunset = today.prayers.filter((p) =>
		["sunrise", "sunset"].includes(p.name.toLowerCase())
	);
	const others = today.prayers.filter(
		(p) => !["sunrise", "sunset"].includes(p.name.toLowerCase())
	);

	const detectedTimezone =
		Intl.DateTimeFormat().resolvedOptions().timeZone ?? "UTC";

	const icons: Record<string, IconDefinition> = {
		fajr: faSun,
		zuhr: faSun,
		asr: faSun,
		maghrib: faMoon,
		isha: faMoon,
		sunrise: faSun,
		sunset: faMoon,
	};

	const fmt = (millis: number) =>
		DateTime.fromMillis(millis)
			.setLocale(locale)
			.setZone(timezone || DateTime.local().zoneName)
			.toLocaleString(DateTime.TIME_SIMPLE);

	return (
		<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-auto">
			<div className="flex justify-end mb-4 gap-2">
				<button
					onClick={() => router.replace(`/${isUrdu ? "en" : "ur"}`)}
					className="px-3 py-1 text-xs rounded bg-gray-200 dark:bg-gray-700 flex items-center gap-1 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
					title={t("switchLanguage")}
				>
					<FontAwesomeIcon icon={faGlobe} />
					<span
						className={`${
							isUrdu ? "font-poppins" : "font-nastaliq pb-2"
						}`}
					>
						{t("switchLanguage")}
					</span>
				</button>
				<button
					onClick={() => setDark(!dark)}
					className="px-3 py-1 text-xs rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
					title={dark ? t("dark") : t("light")}
				>
					<FontAwesomeIcon icon={dark ? faMoon : faSun} />
				</button>
				<button
					onClick={() => router.push("/settings")}
					className="px-3 py-1 text-xs rounded bg-blue-500 text-white hover:bg-blue-600 transition"
					title={t("settings")}
				>
					<FontAwesomeIcon icon={faCog} />
				</button>
			</div>

			<div
				dir={isUrdu ? "rtl" : "ltr"}
				className={`${fontClass} space-y-2`}
			>
				<h2 className="text-2xl font-bold text-center text-gray-400 dark:text-gray-500">
					{t("title")}
				</h2>
				<p className="text-center text-gray-700 dark:text-gray-400">
					{t("subtitle")}
				</p>
				<p className="text-center font-bold text-black dark:text-white mb-1">
					{location}
				</p>
				<p className="text-center text-gray-500 dark:text-gray-400 mb-4">
					{cords
						? `${cords.lat.toFixed(2)}°, ${cords.lng.toFixed(2)}°`
						: `${today.coordinates.latitude}°, ${today.coordinates.longitude}°`}
				</p>

				<ul className="space-y-2 mb-4">
					{sunriseSunset.map(({ name, time }) => {
						const key = name.toLowerCase();
						return (
							<li
								key={key}
								className="grid grid-cols-3 items-center"
							>
								<span
									className={`col-span-1 font-medium ${
										isUrdu ? "text-right" : "text-left"
									}`}
								>
									{t(key)}
								</span>
								<span className="col-span-1 text-center font-semibold text-blue-600 dark:text-blue-400">
									{fmt(time)}
								</span>
								<span
									className={`col-span-1 ${
										isUrdu ? "text-left" : "text-right"
									} text-yellow-500 dark:text-yellow-400`}
								>
									<FontAwesomeIcon icon={icons[key]} />
								</span>
							</li>
						);
					})}
				</ul>

				<hr className="border-gray-300 dark:border-gray-700 mb-4" />

				<ul className="space-y-2">
					{others.map(({ name, time }) => {
						const key = name.toLowerCase();
						return (
							<li
								key={key}
								className="grid grid-cols-3 items-center"
							>
								<span
									className={`col-span-1 text-gray-400 ${
										isUrdu ? "text-right" : "text-left"
									}`}
								>
									{t(key)}
								</span>
								<span className="col-span-1 text-center text-blue-600 dark:text-blue-400">
									{fmt(time)}
								</span>
								<span
									className={`col-span-1 text-indigo-500 dark:text-indigo-400 ${
										isUrdu ? "text-left" : "text-right"
									}`}
								>
									<FontAwesomeIcon icon={icons[key]} />
								</span>
							</li>
						);
					})}
				</ul>

				{
					<p className="text-center text-gray-500 text-xs dark:text-gray-400 mt-4">
						Showing times in {timezone ?? detectedTimezone}
					</p>
				}
			</div>
		</div>
	);
}
