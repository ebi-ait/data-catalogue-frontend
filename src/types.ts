import {ValueGetterFunc} from "ag-grid-community";
import {AppBarProps as MuiAppBarProps} from "@mui/material";

export const HIDE_COLUMN_KEY: string = 'hide';

export interface ColumnConfiguration {
    name: string;
    hide?: boolean;
    field?: string;
    valueGetter?: string | ValueGetterFunc;
    type?: string;
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

export interface Filter {
    label: string;
    data_type: string;
    options: string[]
}

export interface Facet {
    label: string;
    type: string;
    data_type: string;
    options: string[]
}

export interface CatalogueProps {
    schema: any;
}

export interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}
