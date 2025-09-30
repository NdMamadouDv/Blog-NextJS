import React from "react";

function PageTitle({ title }: { title: string }) {
	return <h1 className="text-4xl font-bold text-center mb-12">{title}</h1>;
}

export default PageTitle;
