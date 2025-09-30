import React from "react";
import PageContainer from "./page-container";
import { HeaderNavigation } from "./header-navgation";
import ProfileButton from "./profile-button";
import ResponsiveMenu from "./responsive-menu";
import ToggleTheme from "./toggle-theme";
import Link from "next/link";
export default function Page() {
	return (
		<header className=" border-b">
			<PageContainer>
				<div className="flex items-center justify-between w-full">
					<div className="flex items-center gap-2">
						<ResponsiveMenu />
						<Link href="/">
							<h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-red-600 to-blue-600 ">
								Next Blog
							</h1>
						</Link>
					</div>

					<HeaderNavigation />
					{/* Navigation */}
					{/* Button */}
					<div className="flex items-center gap-5">
						<ToggleTheme />
						{/* Toggle */}
						<ProfileButton />
					</div>
				</div>
			</PageContainer>
		</header>
	);
}
