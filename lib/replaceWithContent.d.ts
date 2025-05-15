export type ElementFunction = () => Element | null;
export type ElementOrFunction = Element | ElementFunction;
export declare function replaceWithContent($node: ElementOrFunction, selector?: string): void;
