import { Annotations } from './model';
/**
 * Добавляет в `html` аннотации `annotations` в виде span-ов со специфическими стилями для последующей визуализации отчёта
 * @param html
 * @param annotations
 */
export declare function annotate(html: string, annotations: Annotations): string;
