window.config = {
    "ENVIRONMENT":"demo",
    "REST_ENDPOINT_URL": 'https://raw.githubusercontent.com/ebi-ait/data-catalogue-frontend-elwazi/main/data/catalogue-data.json',
    "SCHEMA_ENDPOINT_URL": 'https://raw.githubusercontent.com/ebi-ait/data-catalogue-frontend-elwazi/main/data/catalogue-schema.json',
    "RESOURCE_JSON_PATH": '',
    "GRID_CONFIG":  [
        {
            "name": "cohort_name",
        },
        {
            "name": "website",
        },
        {
            "name": "countries"
        },
        {
            "name": "available_data_types.climate_data"
        },
        {
            "name": "demographic",
            "valueGetter": params => params.data.available_data_types.environmental
        }
    ]
}
