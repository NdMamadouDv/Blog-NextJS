import React from "react";
import PageContainer from "./page-container";
import { HeaderNavigation } from "./header-navgation";
import ProfileButton from "./profile-button";
import ResponsiveMenu from "./responsive-menu";
import ToggleTheme from "./toggle-theme";
import Link from "next/link";
import Image from "next/image";
export default function Page() {
	return (
		<header className=" border-b">
			<PageContainer>
				<div className="flex items-center justify-between w-full">
					<div className="flex items-center gap-2">
						<ResponsiveMenu />
						<Link href="/">
							<Image
								src="/img/logo.png"
								alt="logo"
								width={200}
								height={200}
								className="h-12 w-12"
							/>
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
