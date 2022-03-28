export declare type ElementFunction = () => Element | null;
export declare type ElementOrFunction = Element | ElementFunction;
export declare function replaceWithContent($node: ElementOrFunction, selector?: string): void;
