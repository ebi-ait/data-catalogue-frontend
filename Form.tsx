import React, { useState } from 'react';
import { JsonForms } from '@jsonforms/react';
import { initJsonFormsStore } from '@jsonforms/core';
import schema from './schema.json';

const Form: React.FC = () => {
    const [data, setData] = useState({});

    const jsonformsStore = initJsonFormsStore({
        data,
        schema,
        uischema: {},
        renderers: []
    });

    return (
        <div>
            <h1>JSONForms Example</h1>
            <JsonForms
                data={data}
                schema={schema}
                renderers={jsonformsStore.renderers}
                cells={jsonformsStore.cells}
                onChange={({ data }) => setData(data)}
            />
        </div>
    );
};

export default Form;
