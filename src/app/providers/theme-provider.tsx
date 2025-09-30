"use client";
import {
	ThemeProvider as NextThemeProvider,
	ThemeProviderProps,
} from "next-themes";
import React from "react";

function ThemeProvider({ children, ...props }: ThemeProviderProps) {
	return (
		<NextThemeProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange
			{...props}>
			{children}
		</NextThemeProvider>
	);
}

export default ThemeProvider;
