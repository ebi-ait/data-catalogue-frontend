import {ValueGetterFunc} from "ag-grid-community";

export const HIDE_COLUMN_KEY: string = 'hide';

export interface ColumnConfiguration {
    name: string;
    hide?: boolean;
    field?: string;
    valueGetter?: string | ValueGetterFunc;
    //TODO: filters
}
