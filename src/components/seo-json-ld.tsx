import React from "react";

type Props = {
	data: Record<string, unknown> | Record<string, unknown>[];
	id?: string;
};

export default function SeoJsonLd({ data, id }: Props) {
	const json = JSON.stringify(data);

	return (
		<script
			id={id}
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: json }}
		/>
	);
}
