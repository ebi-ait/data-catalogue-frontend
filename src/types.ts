export const HIDE_COLUMN_KEY: string = 'hide';

export interface ColumnConfiguration {
    name: string;
    hide?: boolean;
    //TODO: filters
}
