/**
 * Cleaning the html removing all styles, empty spans, removing annotations and so on
 */
export declare function cleanupHtml(html: string, document: Document, removeAnnotations?: boolean): string;
/**
 * Remove all Litera5 annotation spans from the text (good for saving document)
 */
export declare function cleanupAnnotations(html: string, document: Document): string;
