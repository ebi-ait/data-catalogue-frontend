// api.ts

export const fetchSchema = async (): Promise<any> => {
    function fixSchemaIdAttribute(schemaData: { [x: string]: any; id: any; }) {
        if ('id' in schemaData) {
            schemaData['$id'] = schemaData['id']
            delete schemaData.id
        }
    }

    try {
        const response = await fetch(window?.appConfig.SCHEMA_ENDPOINT_URL,
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
        const response = await fetch(window?.appConfig.REST_ENDPOINT_URL,
            {
                headers: {
                    'Accept': 'application/json'
                }
            });
        if (!response.ok) {
            throw new Error('Failed to fetch catalogue data');
        }

        const data = await response.json();
        if (Array.isArray(data)) {
            return data;
        } else {
            return window?.appConfig.RESOURCE_JSON_PATH
                .split('.')
                .reduce((result: any, current: string) => result[current], data);
        }
    } catch (error) {
        console.error('Error fetching catalogue data:', error);
        throw error;
    }
};

