"use client";
import { Moon, Sun } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";

function ToggleTheme() {
	const { theme, setTheme } = useTheme();
	const toggleTheme = () => {
		setTheme(theme === "dark" ? "light" : "dark");
	};
	return (
		<div>
			<Button
				variant="ghost"
				size="icon"
				onClick={toggleTheme}
				className="flex justify-center">
				<Moon className="h-6 w-6 scale-100 dark:scale-0" />
				<Sun className="h-6 w-6 dark:scale-100 scale-0" />
			</Button>
		</div>
	);
}

export default ToggleTheme;
