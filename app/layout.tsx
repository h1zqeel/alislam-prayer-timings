import { PrayerProvider } from "@/context/prayer";
import "./globals.css";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <PrayerProvider>{children}</PrayerProvider>;
}
