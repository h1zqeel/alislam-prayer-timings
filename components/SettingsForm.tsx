"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faArrowLeft,
	faSave,
	faMapMarkerAlt,
	faCircleNotch,
} from "@fortawesome/free-solid-svg-icons";
import { useStorage } from "@/hooks/useStorage";
import { usePrayer } from "@/context/prayer";

type LocationSettings = {
	address: string;
	latitude: string;
	longitude: string;
	timezone: string;
};

const allTimezones =
	typeof Intl !== "undefined" && "supportedValuesOf" in Intl
		? Intl.supportedValuesOf("timeZone")
		: ["UTC", "Asia/Karachi", "America/New_York"];

export default function SettingsPage() {
	const t = useTranslations("SettingsPage");
	const locale = useLocale();
	const isUrdu = useMemo(() => locale === "ur", [locale]);
	const router = useRouter();
	const { setCords, setTimezone, refresh, cords, timezone } = usePrayer();

	const detectedTimezone = useMemo(
		() => Intl.DateTimeFormat().resolvedOptions().timeZone,
		[]
	);

	const timezoneOptions = useMemo(() => {
		const opts = allTimezones.map((tz) => ({ label: tz, value: tz }));
		const filtered = opts.filter((o) => o.value !== detectedTimezone);
		return [
			{ label: detectedTimezone, value: detectedTimezone },
			...filtered,
		];
	}, [detectedTimezone]);

	const [form, setForm] = useStorage<LocationSettings>("settings", {
		address: "",
		latitude: cords?.lat.toString() || "",
		longitude: cords?.lng.toString() || "",
		timezone: timezone || detectedTimezone,
	});

	const [isDark, setIsDark] = useState(false);
	const [geocoding, setGeocoding] = useState(false);

	useEffect(() => {
		setIsDark(document.documentElement.classList.contains("dark"));
	}, []);

	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setForm({ ...form, [name]: value });
	};

	const handleTimezoneChange = (
		opt: { label: string; value: string } | null
	) => {
		if (opt) setForm({ ...form, timezone: opt.value });
	};

	const geocodeAddress = async () => {
		if (!form.address) return;
		setGeocoding(true);
		try {
			const res = await fetch(
				`https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
					form.address
				)}`
			);
			const results = await res.json();
			if (results[0]) {
				const { lat, lon } = results[0];
				setForm({
					...form,
					latitude: String(lat),
					longitude: String(lon),
				});
			}
		} catch {
			console.error("Geocode failed");
		} finally {
			setGeocoding(false);
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const lat = parseFloat(form.latitude);
		const lng = parseFloat(form.longitude);
		refresh(lat, lng);
		setCords({ lat, lng });
		setTimezone(form.timezone);
		router.back();
	};

	const isSaveDisabled =
		geocoding ||
		!form.latitude ||
		!form.longitude ||
		isNaN(Number(form.latitude)) ||
		isNaN(Number(form.longitude));

	return (
		<form
			dir={isUrdu ? "rtl" : "ltr"}
			onSubmit={handleSubmit}
			className={`relative bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-2xl shadow-xl p-6 pt-10 pb-8 w-full max-w-md mx-auto ${
				isUrdu ? "font-nastaliq" : "font-poppins"
			}`}
		>
			<button
				type="button"
				onClick={() => router.back()}
				className={`absolute top-4 ${
					isUrdu ? "right-4" : "left-4"
				} flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300 hover:underline`}
			>
				<FontAwesomeIcon icon={faArrowLeft} />
				{t("goBack")}
			</button>

			<h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200">
				{t("settings")}
			</h2>

			<div className="mb-4">
				<label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">
					{t("address")}
				</label>
				<div className="flex gap-2">
					<input
						name="address"
						value={form.address}
						onChange={handleInput}
						className="flex-1 p-2 border rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white"
						placeholder={t("addressPlaceholder")}
						disabled={geocoding}
					/>
					<button
						type="button"
						onClick={geocodeAddress}
						disabled={geocoding || !form.address}
						className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center justify-center"
					>
						{geocoding ? (
							<FontAwesomeIcon
								icon={faCircleNotch}
								className="animate-spin"
							/>
						) : (
							<p className="flex items-center gap-1 text-sm">
								{t("loadGeocode")}
								<FontAwesomeIcon icon={faMapMarkerAlt} />
							</p>
						)}
					</button>
				</div>
			</div>

			<div className="mb-4">
				<label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">
					{t("latitude")}
				</label>
				<input
					name="latitude"
					value={form.latitude}
					onChange={handleInput}
					className="w-full p-2 border rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white"
					disabled={geocoding}
				/>
			</div>

			<div className="mb-4">
				<label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">
					{t("longitude")}
				</label>
				<input
					name="longitude"
					value={form.longitude}
					onChange={handleInput}
					className="w-full p-2 border rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white"
					disabled={geocoding}
				/>
			</div>

			<div className="mb-6">
				<label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">
					{t("timezone")}
				</label>
				<Select
					options={timezoneOptions}
					value={timezoneOptions.find(
						(z) => z.value === form.timezone
					)}
					onChange={handleTimezoneChange}
					isClearable
					placeholder={t("selectTimezone")}
					isDisabled={geocoding}
					styles={{
						control: (base) => ({
							...base,
							backgroundColor: isDark ? "#1f2937" : "#fff",
							borderColor: isDark ? "#4b5563" : "#d1d5db",
							boxShadow: "none",
							direction: isUrdu ? "rtl" : "ltr",
						}),
						menu: (base) => ({
							...base,
							backgroundColor: isDark ? "#1f2937" : "#fff",
							direction: isUrdu ? "rtl" : "ltr",
							zIndex: 20,
						}),
						singleValue: (base) => ({
							...base,
							color: isDark ? "#f9fafb" : "#111827",
						}),
						option: (base, state) => ({
							...base,
							backgroundColor: state.isFocused
								? isDark
									? "#374151"
									: "#e5e7eb"
								: "transparent",
							color: isDark ? "#f9fafb" : "#111827",
							direction: isUrdu ? "rtl" : "ltr",
						}),
					}}
				/>
			</div>

			<button
				type="submit"
				disabled={isSaveDisabled}
				className={`w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition ${
					isSaveDisabled ? "opacity-50 cursor-not-allowed" : ""
				}`}
			>
				<FontAwesomeIcon icon={faSave} />
				{t("save")}
			</button>
		</form>
	);
}
