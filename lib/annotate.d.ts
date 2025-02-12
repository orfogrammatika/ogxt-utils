import { Annotations } from './model';
export interface EditorAnnotation {
    id: number;
    alternateId?: string;
    tuid?: string;
    idx: number;
    kind: string;
    group: string;
    intensity?: number;
    classes: string;
    attr: {
        start: boolean;
        end: boolean;
        large: boolean;
    };
}
export interface EditorSpan {
    start: number;
    end: number;
    annotations: EditorAnnotation[];
}
export interface SpanSuggestion {
    start: number;
    end: number;
    suggestions: {
        annotationId: number;
        suggestions: {
            idx: number;
            value: string;
        }[];
    }[];
}
export interface HtmlWithEditorSpan {
    html: string;
    spans: EditorSpan[];
}
/**
 * Добавляет в `html` аннотации `annotations` в виде span-ов со специфическими стилями для последующей визуализации отчёта
 * При этом возвращает группировки span-ов, чтобы вызывающему коду можно было понять структуру без парсинга html
 * @param html
 * @param annotations
 * @return HtmlWithEditorSpan
 */
export declare function annotate_and_get_html_with_spans(html: string, annotations: Annotations): HtmlWithEditorSpan;
/**
 * Добавляет в `html` аннотации `annotations` в виде span-ов со специфическими стилями для последующей визуализации отчёта.
 * Возвращает только html строку
 * @param html
 * @param annotations
 */
export declare function annotate(html: string, annotations: Annotations): string;
/**
 * Добавляет в `html` аннотации `annotations` в виде span-ов со специфическими стилями для последующей визуализации отчёта
 * При этом перед формированием html вызывает переданную функцию разбиения совета по span-ам, на которые разбивается аннотация.
 * Возвращает html строку, там, где совет разбивается и его можно применить по частям, добавляются атрибуты с советами
 * @param html
 * @param annotations
 * @param splitSuggestion
 */
export declare function annotate_with_suggestion(html: string, annotations: Annotations, splitSuggestion: (spans: EditorSpan[], annotations: Annotations) => SpanSuggestion[]): string;
