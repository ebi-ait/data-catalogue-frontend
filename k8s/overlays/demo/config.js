window.appConfig = {
    "ENVIRONMENT": "demo",
    "basename": "/catalogue/demo",
    "REST_ENDPOINT_URL": '/biosamples/samples?filter=attr%3Aproject+name%3AMICROBE',
    "SCHEMA_ENDPOINT_URL": '/biosamples/schemas/core/sample.json',
    "RESOURCE_JSON_PATH": '_embedded.samples',
    "GRID_CONFIG": [
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
            "name": "collectionDate",
            valueGetter: params => params.data.characteristics?.["collection date"]?.[0].text
        },
       {
            "name": "broadScaleEnvironmentalContext",
            valueGetter: params => params.data.characteristics?.["broad-scale environmental context"]?.[0].text
        },       {
            "name": "environmentalMedium",
            valueGetter: params => params.data.characteristics?.["environmental medium"]?.[0].text
        },       {
            "name": "regionAndLocality",
            valueGetter: params => params.data.characteristics?.["geographic location (region and locality)"]?.[0].text
        },       {
            "name": "countryAndOrSea))",
            valueGetter: params => params.data.characteristics?.["geographic location (country and/or sea)"]?.[0].text
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
            range_interval: 3
        }
    ]

}
