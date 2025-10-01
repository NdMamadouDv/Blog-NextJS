"use client";

import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import type { Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Heading from "@tiptap/extension-heading";
import Blockquote from "@tiptap/extension-blockquote";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import CodeBlock from "@tiptap/extension-code-block";
// import Link from "@tiptap/extension-link"; // optionnel

type Props = {
	value: string;
	onChange: (html: string) => void;
	placeholder?: string;
	className?: string;
};

const headingOptions = ["paragraph", "h1", "h2", "h3", "h4"] as const;
type HeadingValue = (typeof headingOptions)[number];
type HeadingLevel = 1 | 2 | 3 | 4;

const headingLevelMap: Record<Exclude<HeadingValue, "paragraph">, HeadingLevel> = {
	h1: 1,
	h2: 2,
	h3: 3,
	h4: 4,
};

const getHeadingLevel = (value: HeadingValue): HeadingLevel | null =>
	value === "paragraph" ? null : headingLevelMap[value];

const isHeadingValue = (value: string): value is HeadingValue =>
	headingOptions.includes(value as HeadingValue);

export default function TiptapAvecToolbar({
	value,
	onChange,
	placeholder = "Écrivez votre contenu…",
	className = "",
}: Props) {
	const editor = useEditor({
		content: value,
		extensions: [
			StarterKit.configure({
				// on garde tout SAUF ceux qu’on remplace explicitement
				heading: false,
				blockquote: false,
				bulletList: false,
				orderedList: false,
				listItem: false,
				codeBlock: false,
			}),

			// === blocs explicitement ajoutés ===
			Heading.configure({ levels: [1, 2, 3, 4] }),
			Blockquote,
			BulletList,
			OrderedList,
			ListItem,
			CodeBlock, // (ou CodeBlockLowlight si tu veux la coloration)

			// === “style/UX” ===
			Typography,
			TextStyle,
			Color,
			Placeholder.configure({
				placeholder,
				includeChildren: true,
				emptyEditorClass: "is-editor-empty",
			}),
		],
		editorProps: {
			attributes: {
				class:
					"tiptap prose dark:prose-invert min-h-[16rem] p-4 rounded-md border outline-none focus:ring-2",
			},
		},
		onUpdate: ({ editor }) => onChange(editor.getHTML()),
		immediatelyRender: false,
	});

	if (!editor) return null;

	return (
		<div className={className}>
			<Toolbar editor={editor} />
			<EditorContent editor={editor} />
		</div>
	);
}

/** ---------- Toolbar sans dépendances externes ---------- */
function Toolbar({ editor }: { editor: Editor }) {
	return (
		<div className="mb-2 flex flex-wrap items-center gap-4">
			<Btn
				on={() => editor.chain().focus().toggleBold().run()}
				active={editor.isActive("bold")}>
				Gras
			</Btn>
			<Btn
				on={() => editor.chain().focus().toggleItalic().run()}
				active={editor.isActive("italic")}>
				Italique
			</Btn>
			<Divider />

			<Btn
				on={() => editor.chain().focus().toggleBulletList().run()}
				active={editor.isActive("bulletList")}>
				•
			</Btn>
			<Btn
				on={() => editor.chain().focus().toggleOrderedList().run()}
				active={editor.isActive("orderedList")}>
				1.
			</Btn>
			<Divider />

			<HeadingSelect
				value={
					headingOptions.find((key) => {
						if (key === "paragraph") {
							return editor.isActive("paragraph");
						}

						const level = getHeadingLevel(key);
						return level !== null && editor.isActive("heading", { level });
				}) ?? "paragraph"
				}
				onChange={(val) => {
					const chain = editor.chain().focus();
					const level = getHeadingLevel(val);

					if (level === null) {
						chain.setParagraph().run();
						return;
					}

					chain.toggleHeading({ level }).run();
				}}
			/>

			<Divider />

			<Btn
				on={() => editor.chain().focus().toggleBlockquote().run()}
				active={editor.isActive("blockquote")}>
				❝
			</Btn>
			<Btn
				on={() => editor.chain().focus().toggleCodeBlock().run()}
				active={editor.isActive("codeBlock")}>
				{"</>"}
			</Btn>

			<Divider />

			<Btn on={() => editor.chain().focus().undo().run()}>↶</Btn>
			<Btn on={() => editor.chain().focus().redo().run()}>↷</Btn>

			<Btn on={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}>
				Reset
			</Btn>
		</div>
	);
}

function Btn({
	children,
	on,
	active,
}: {
	children: React.ReactNode;
	on: () => void;
	active?: boolean;
}) {
	return (
		<button
			type="button"
			onClick={on}
			className={[
				"px-2 py-1 text-sm rounded-md border transition",
				active
					? "bg-black text-white dark:bg-white dark:text-black"
					: "bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-800",
			].join(" ")}>
			{children}
		</button>
	);
}

function Divider() {
	return <span className="mx-1 h-5 w-px bg-gray-300 dark:bg-neutral-700" />;
}

function HeadingSelect({
	value,
	onChange,
}: {
	value: HeadingValue;
	onChange: (v: HeadingValue) => void;
}) {
	const handleChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
		const nextValue = event.target.value;

		if (isHeadingValue(nextValue)) {
			onChange(nextValue);
		}
	};

	return (
		<select
			className="h-8 rounded-md border bg-transparent px-2 text-sm"
			value={value}
			onChange={handleChange}>
			<option value="paragraph">Paragraphe</option>
			<option value="h1">H1</option>
			<option value="h2">H2</option>
			<option value="h3">H3</option>
			<option value="h4">H4</option>
		</select>
	);
}
