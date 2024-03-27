window.appConfig = {
    "ENVIRONMENT":"demo",
    "basename":"/",
    "REST_ENDPOINT_URL": '/biosamples/samples?filter=attr%3Aproject+name%3AMICROBE',    "SCHEMA_ENDPOINT_URL": '/biosamples/schemas/core/sample.json',
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
            valueGetter: params => params.data.characteristics?.organism[0]?.text
        },
        {
            "name": "biome",
            valueGetter: params => params.data.characteristics?.biome?.[0]?.text
        },
        {
            "name": "soilType",
            valueGetter: params => params.data.characteristics?.["soil type"]?.[0].text
        },
        {
            "name": "pH",
            valueGetter: params => params.data.characteristics?.pH?.[0].text
        },
        {
            "name": "publication",
            "valueGetter": params => params.data?.publications?.[0]?.pubmed_id
        },
        {
            "name": "project name",
            "valueGetter": params => params.data.characteristics?.["project name"]?.[0]?.text
        }
    ],

    FILTER_FIELDS: [
        {
            field: "soilType",
            type: "checkbox",
            data_type: "string"
        }, {
            field: "organism",
            type: "checkbox",
            data_type: "string"
        },
        {
            field: "pH",
            type: "checkbox",
            data_type: "numeric_range",
            range_interval: 2
        }
    ]

}
