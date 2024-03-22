export const HIDE_COLUMN_KEY: string = 'hide';

export interface ColumnConfiguration {
    name: string;
    hide?: boolean;
    //TODO: filters
}

export const FILTER_DATA_TYPE = {
    string: "string",
    numeric_range:"numeric_range",
    string_range:"string_range"
};
