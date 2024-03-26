
import {ColumnConfiguration, FilterDataType, SideFilter} from "./types";

export const REST_ENDPOINT_URL: string = 'http://127.0.0.1:5000/document';
export const SCHEMA_ENDPOINT_URL: string = 'http://127.0.0.1:5000/document/schema';
export const RESOURCE_TYPE_PLURAL: string = 'documents'

export const GRID_CONFIG: ColumnConfiguration[] = [
        {
            name: "title",
        },
        {
            name: "dsIAfricaAffiliation",
        },
        {
            name: "description",
            hide: true
        },
        {
            name: "keywords",
        }
    ]
;

export const FILTER_FIELDS:SideFilter[] = [ {
        field: "title",
        type:"select",
        data_type: FilterDataType.string
}, {
        field: "acronym",
        type:"checkbox",
        data_type: FilterDataType.string
},
    {
        field: "submissions",
        type:"numeric_slider",
        data_type:FilterDataType.numeric_slider,
        range_interval:8
    }
]
