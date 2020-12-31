import React from "react";
import {SyntaxHighlighterProps} from "react-syntax-highlighter";

interface RNSyntaxHighlighterProps
	extends Omit<
		SyntaxHighlighterProps,
		| "lineProps"
		| "useInlineStyles"
		| "showLineNumbers"
		| "startingLineNumber"
		| "lineNumberContainerStyle"
		| "lineNumberStyle"
	> {
	fontFamily?: string;
	fontSize?: number;
	highlighter?: string;
}

export default class SyntaxHighlighter extends React.Component<RNSyntaxHighlighterProps> {}
