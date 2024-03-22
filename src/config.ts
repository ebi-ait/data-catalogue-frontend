
import {ColumnConfiguration, FILTER_DATA_TYPE} from "./types";

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

export const FILTER_FIELDS = [ {
        field: "title",
        type:"select",
        data_type: FILTER_DATA_TYPE.string
}, {
        field: "acronym",
        type:"checkbox",
        data_type: FILTER_DATA_TYPE.string
},
    {
        field: "submissions",
        type:"checkbox",
        data_type:FILTER_DATA_TYPE.numeric_range,
        range_interval:8
    }
]
