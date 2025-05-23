import { NextIntlClientProvider } from "next-intl";
import { Poppins, Noto_Nastaliq_Urdu } from "next/font/google";

const poppins = Poppins({
	variable: "--font-poppins",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
});

const nastaliq = Noto_Nastaliq_Urdu({
	variable: "--font-nastaliq",
	subsets: ["arabic"],
	weight: ["400"],
});

export default async function LocaleLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;

	return (
		<html className={`${poppins.variable} ${nastaliq.variable}`}>
			<head>
				<meta
					httpEquiv="Permissions-Policy"
					content="geolocation=self"
				/>
			</head>
			<body className="antialiased font-sans">
				<NextIntlClientProvider locale={locale}>
					{children}
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
