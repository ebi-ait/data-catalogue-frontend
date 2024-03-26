export const HIDE_COLUMN_KEY: string = 'hide';

export interface ColumnConfiguration {
    name: string;
    hide?: boolean;
    //TODO: filters
}

export enum FilterDataType  {
    string = "string",
    numeric_range ="numeric_range",
    string_range = "string_range",
    numeric_slider="numeric_slider"
}

export interface SideFilter {
    field: string,
    type:string,
    data_type?:FilterDataType,
    range_interval?:number

}
