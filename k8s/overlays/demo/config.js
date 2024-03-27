window.appConfig = {
    "ENVIRONMENT":"demo",
    "basename":"/catalogue/demo",
    "REST_ENDPOINT_URL": '/biosamples/samples',
    "SCHEMA_ENDPOINT_URL": '/biosamples/schemas/core/sample.json',
    "RESOURCE_JSON_PATH": '_embedded.samples',
    "GRID_CONFIG":  [
        {
            "name": "name",
        },
        {
            "name": "release",
        },
        {
            "name": "organism",
            valueGetter: params => params.data.characteristics?.organism[0].text
        },
        {
            "name": "publication",
            "valueGetter": params => params.data?.publications?.[0]?.pubmed_id
        },
        {
            "name": "project name",
            "valueGetter": params => params.data.characteristics?.["project name"]?.[0]?.text
        }
    ]
}
