import {ValueGetterFunc} from "ag-grid-community";

export const HIDE_COLUMN_KEY: string = 'hide';

export interface ColumnConfiguration {
    name: string;
    hide?: boolean;
    field?: string;
    valueGetter?: string | ValueGetterFunc;
    //TODO: filters
}
export interface Config {
    ENVIRONMENT:string;
    basename:string;
    REST_ENDPOINT_URL:string;
    SCHEMA_ENDPOINT_URL: string;
    RESOURCE_JSON_PATH: string;
    GRID_CONFIG:  ColumnConfiguration[];
}

export enum FilterDataType  {
    string = "string",
    numeric_range ="numeric_range",
    string_range = "string_range"
}

export interface SideFilter {
    field: string,
    type:string,
    data_type?:FilterDataType,
    range_interval?:number

}
