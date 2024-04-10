import {fetchUtils, GetListParams, GetListResult, GetOneParams, GetOneResult} from "react-admin";
import {stringify} from "query-string";

const httpClient = fetchUtils.fetchJson;

const apiUrl = import.meta.env.VITE_SIMPLE_REST_URL

function buildFilterQueryString(filter: any) {
    const filterType = filter.field=='accession'?'acc':'attr';
    if(filterType=="acc") {
        return `acc%3A${filter.value}`
    } else {
        // TODO support other filter types. See https://www.ebi.ac.uk/biosamples/docs/references/filters
        return `attr%3A${filter.field}%3A${filter.value}`
    }
}

function addUserFilter(params: GetListParams) {
    let userFilter: string = ''
    if (params?.filter?.field) {
        const filterQueryString = buildFilterQueryString(params.filter)

        userFilter = `&filter=${filterQueryString}`;
    }
    return userFilter;
}

export const dataProvider = {
    getList: (resource: string, params: GetListParams): Promise<GetListResult> => {
        const {page, perPage} = params.pagination;
        const {field, order} = params.sort;
        const query = {
            size: perPage,
        };
        const initialFilter: string = '&filter=attr%3Aproject+name%3AMICROBE'
            + '&filter=attr%3Acenter'
            + '&filter=attr%3Apreservation%20temperature';
        let userFilter = addUserFilter(params);
        const url = `${apiUrl}/${resource}?${stringify(query)}${initialFilter}${userFilter}`;
        return httpClient(url, {method: 'GET'})
            .then(response => {
                const {json} = response
                const data = json._embedded[resource]
                    .map(doc => ({id: doc.accession, ...doc}));
                return {
                    data,
                    pageInfo: {
                        hasNextPage: json?._links?.next ?? false
                    }
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
    getMany: (resource, params) => {
        console.log(`resource: ${resource}, params: ${JSON.stringify(params)}`);
    }

};
