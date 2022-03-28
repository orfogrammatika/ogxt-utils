interface Position {
    start: number;
    end: number;
}
interface Annotation {
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
interface Annotations {
    kinds: {
        [key: string]: string;
    };
    annotations: Annotation[];
}
export declare function annotate(html: string, annotations: Annotations): string;
export {};
