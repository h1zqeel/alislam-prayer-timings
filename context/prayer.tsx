// /context/prayer.tsx
"use client";

import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
	PropsWithChildren,
} from "react";

type Prayer = { name: string; time: number; audio: string | null };
type DayTiming = {
	prayers: Prayer[];
	coordinates: { latitude: string; longitude: string };
};

type PrayerContextValue = {
	today: DayTiming | null;
	loading: boolean;
	error: string | null;
	cords: { lat: number; lng: number } | null;
	location?: string;
	timezone?: string;
	setTimezone: (tz: string) => void;
	setCords: (cords: { lat: number; lng: number }) => void;
	refresh: (lat?: number, lng?: number) => void;
};

const PrayerContext = createContext<PrayerContextValue | null>(null);

async function fetchTimings(lat?: number, lng?: number): Promise<DayTiming> {
	const params = lat != null && lng != null ? `?lat=${lat}&lng=${lng}` : "";
	const res = await fetch(
		`https://alislam.org/adhan/api/timings/day${params}`,
		{ cache: "no-store" }
	);
	if (!res.ok) throw new Error("Failed to fetch timings");
	const data = await res.json();
	return data.multiDayTimings[0];
}

async function fetchAddress(lat: number, lon: number): Promise<string> {
	const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
	const res = await fetch(url);
	if (!res.ok) throw new Error("Failed to fetch address");
	const js = await res.json();
	const addr = js.address || {};
	const city = addr.city || addr.town || addr.village || addr.hamlet;
	const country = addr.country;
	return [city, country].filter(Boolean).join(", ");
}

export function PrayerProvider({ children }: PropsWithChildren<object>) {
	const [today, setToday] = useState<DayTiming | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [cords, setCords] = useState<{ lat: number; lng: number } | null>(
		null
	);
	const [location, setLocation] = useState<string>("");
	const [timezone, setTimezone] = useState<string | undefined>(undefined);

	const load = useCallback(async (lat?: number, lng?: number) => {
		setLoading(true);
		try {
			const dt = await fetchTimings(lat, lng);
			setToday(dt);
			const latitude = parseFloat(dt.coordinates.latitude);
			const longitude = parseFloat(dt.coordinates.longitude);
			if (lat != null && lng != null) {
				setCords({
					lat: latitude,
					lng: longitude,
				});
			}
			const loc = await fetchAddress(latitude, longitude);
			setLocation(loc);
			setError(null);
		} catch (e) {
			console.error(e);
			setError("Something went wrong");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(pos) => {
					load(pos.coords.latitude, pos.coords.longitude);
				},
				() => {
					load(-33.8688, 151.2093);
					console.warn("Unable to retrieve location");
				}
			);
		} else {
			// Fallback to default Sydney coordinates
			load(-33.8688, 151.2093);
		}
	}, [load]);

	const refresh = (lat?: number, lng?: number) => {
		if (lat != null && lng != null) {
			load(lat, lng);
		}
	};

	return (
		<PrayerContext.Provider
			value={{
				today,
				loading,
				error,
				cords,
				location,
				timezone,
				setTimezone,
				setCords,
				refresh,
			}}
		>
			{children}
		</PrayerContext.Provider>
	);
}

export function usePrayer() {
	const ctx = useContext(PrayerContext);
	if (!ctx) throw new Error("usePrayer must be used inside PrayerProvider");
	return ctx;
}
