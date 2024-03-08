// api.ts
import {
    RESOURCE_TYPE_PLURAL,
    REST_ENDPOINT_URL,
    SCHEMA_ENDPOINT_URL} from "./config";

export const fetchSchema = async (): Promise<any> => {
    try {
        const response = await fetch(SCHEMA_ENDPOINT_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch schema data');
        }
        const schemaData = await response.json();
        return schemaData;
    } catch (error) {
        console.error('Error fetching schema data:', error);
        throw error;
    }
};

export const fetchCatalogueData = async (): Promise<any[]> => {
    try {
        const response = await fetch(REST_ENDPOINT_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch catalogue data');
        }
        const data = await response.json();
        const documents = data?._embedded[RESOURCE_TYPE_PLURAL] ?? [];
        return documents;
    } catch (error) {
        console.error('Error fetching catalogue data:', error);
        throw error;
    }
};
export const filterCatalogueData = async (): Promise<any[]> => {
    try {
        const response = await fetch(REST_ENDPOINT_URL+"/65d4772bb13812efa4a8e4ee");
        if (!response.ok) {
            throw new Error('Failed to fetch catalogue data');
        }
        const data = await response.json();
        const documents = data?._embedded[RESOURCE_TYPE_PLURAL] ?? [];
        return documents;
    } catch (error) {
        console.error('Error fetching catalogue data:', error);
        throw error;
    }
};

