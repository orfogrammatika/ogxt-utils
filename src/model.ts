export interface Position {
	start: number;
	end: number;
}

export interface Annotation {
	id: number;
	alternateId?: string;
	tuid?: string;
	kind: string;
	selection: string;
	description: string;
	suggestion: string;
	suggestionId: number;
	explanation: string;
	intensity?: number;
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
