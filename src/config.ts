
import {ColumnConfiguration} from "./types";

export const REST_ENDPOINT_URL: string = 'http://127.0.0.1:5002/document';
export const SCHEMA_ENDPOINT_URL: string = 'http://127.0.0.1:5002/document/schema';
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

export const FILTER_FIELDS = [ {field: "title"}, {field: "acronym"} ]
