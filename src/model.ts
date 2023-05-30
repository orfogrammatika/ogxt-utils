export interface Position {
	start: number;
	end: number;
}

export interface Annotation {
	id: number;
	kind: string;
	selection: string;
	description: string;
	suggestion: string;
	suggestionId: number;
	explanation: string;
	rule: string;
	group: string;
	attrs: string[];
	position: Position[];
}

export interface Annotations {
	kinds: {
		[key: string]: string;
	};
	annotations: Annotation[];
}
