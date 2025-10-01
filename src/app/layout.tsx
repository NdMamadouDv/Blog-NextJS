import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/header";
import ThemeProvider from "./providers/theme-provider";
import Footer from "@/components/footer";
import AppProvider from "./providers/app-provider";
import { siteConfig } from "@/lib/site-config";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const ogImageUrl = siteConfig.ogImage.startsWith("http")
	? siteConfig.ogImage
	: `${siteConfig.url}${siteConfig.ogImage}`;

export const metadata: Metadata = {
	metadataBase: new URL(siteConfig.url),
	title: {
		default: siteConfig.name,
		template: "%s | Mamadou Ndiaye",
	},
	description: siteConfig.description,
	keywords: siteConfig.keywords,
	icons: {
		icon: "/img/favicon.ico",
	},
	authors: [{ name: siteConfig.creator }],
	creator: siteConfig.creator,
	publisher: siteConfig.creator,
	alternates: {
		canonical: siteConfig.url,
	},
	openGraph: {
		type: "website",
		locale: siteConfig.locale,
		siteName: siteConfig.name,
		title: siteConfig.name,
		description: siteConfig.description,
		url: siteConfig.url,
		images: [
			{
				url: ogImageUrl,
				width: 1200,
				height: 630,
				alt: siteConfig.name,
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: siteConfig.name,
		description: siteConfig.description,
		images: [ogImageUrl],
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
		},
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="fr" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<AppProvider>
					<ThemeProvider>
						<div className="flex min-h-screen flex-col justify-between">
							<Header />
							<div className="flex-grow">{children}</div>
							<Footer />
						</div>
					</ThemeProvider>
				</AppProvider>
			</body>
		</html>
	);
}
