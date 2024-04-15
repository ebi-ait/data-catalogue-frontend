import {fetchUtils, GetListParams, GetListResult, GetOneParams, GetOneResult} from "react-admin";
import {stringify} from "query-string";

const httpClient = fetchUtils.fetchJson;

const apiUrl = import.meta.env.VITE_SIMPLE_REST_URL

function buildFilterQuery(filter: any):string[] {
    return (filter===undefined)?[]:Object.entries(filter)
        .flatMap(([attr,values])=> {
            if (attr == 'accession') {
                return `acc:${filter.value}`
            } else if (attr .startsWith('characteristics.')) {
                const attributeName = attr.replace('characteristics.', '');
                return values.map(value=>(`attr:${attributeName}:${value}`));
            } else {
                // TODO support other filter types. See https://www.ebi.ac.uk/biosamples/docs/references/filters
                debugger;
                const errorMessage = `attribute not not supported for filtering: ${attr}`;
                console.error(errorMessage)
                throw Error(errorMessage)
            }
        })
        ;
}

export const dataProvider = {
    getList: (resource: string, params: GetListParams): Promise<GetListResult> => {
        const {page, perPage} = params.pagination;
        const {field, order} = params?.sort;
        const query = {
            page:page-1, // NOTE react admin starts the page count from 1, but spring starts from 0
            size: perPage,
            filter:[] as string[]
        };
        const initialFilter: string =
            '&filter=attr%3Aproject+name%3AMICROBE'
            + '&filter=attr%3Acenter';
        query.filter = query.filter.concat(buildFilterQuery(params.filter));
        const url = `${apiUrl}/${resource}?${stringify(query)}${initialFilter}`;
        return httpClient(url, {method: 'GET'})
            .then(response => {
                const {json} = response
                const data = json._embedded[resource]
                    .map(doc => ({id: doc.accession, ...doc}));
                return {
                    data,
                    pageInfo: {
                        hasNextPage: json?._links?.next ?? false
                    },
                    total: json.page.totalElements
                }
            });
    },
    getOne: (resource: string, params: GetOneParams): Promise<GetOneResult> => {
        const url = `${apiUrl}/${resource}/${params.id}`;
        return httpClient(url, {method: 'GET'})
            .then(response => {
                const {json} = response;
                return {data: {id: json.accession, ...json}};
            });
    },
    getMany: (resource, params) => console.log(`resource: ${resource}, params: ${JSON.stringify(params)}`),

    getManyReference: (resource, params) => console.error(`unsupported operation`),
    update: (resource, params) => console.error(`unsupported operation`),
    updateMany: (resource, params) => console.error(`unsupported operation`),
    create: (resource, params) => console.error(`unsupported operation`),
    delete: (resource, params) => console.error(`unsupported operation`),
    deleteMany: (resource, params) => console.error(`unsupported operation`),
};
