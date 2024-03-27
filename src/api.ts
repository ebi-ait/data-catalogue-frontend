// api.ts

const config = window?.appConfig;

export const fetchSchema = async (): Promise<any> => {
    function fixSchemaIdAttribute(schemaData: { [x: string]: any; id: any; }) {
        if ('id' in schemaData) {
            schemaData['$id'] = schemaData['id']
            delete schemaData.id
        }
    }

    try {
        const response = await fetch(config.SCHEMA_ENDPOINT_URL,
            {
                headers: {
                    'Accept': 'application/json'
                }
            });
        if (!response.ok) {
            throw new Error('Failed to fetch schema data');
        }
        const schemaData = await response.json();
        fixSchemaIdAttribute(schemaData);
        return schemaData;
    } catch (error) {
        console.error('Error fetching schema data:', error);
        throw error;
    }
};

export const fetchCatalogueData = async (): Promise<any[]> => {
    try {
        const response = await fetch(config.REST_ENDPOINT_URL,
            {
                headers: {
                    'Accept': 'application/json'
                }
            });
        if (!response.ok) {
            throw new Error('Failed to fetch catalogue data');
        }
        const data = await response.json();
        // const documents = data?._embedded[window.config.RESOURCE_TYPE_PLURAL] ?? [];
        const documents = config.RESOURCE_JSON_PATH
            .split('.')
            .reduce((result:any, current:string) => result[current], data)

        return documents ? documents : data;
    } catch (error) {
        console.error('Error fetching catalogue data:', error);
        throw error;
    }
};
