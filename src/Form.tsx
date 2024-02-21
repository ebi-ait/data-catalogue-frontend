// Form.tsx
import React, {useState} from 'react';
import {JsonForms} from '@jsonforms/react';
import {materialCells, materialRenderers} from '@jsonforms/material-renderers';
import {REST_ENDPOINT_URL} from "./config";
import style from "./Form.module.css";
import MoreCellRenderer from "./MoreCellRenderer/MoreCellRenderer";

interface FormProps {
    schema: any;
}

const Form: React.FC<FormProps> = ({schema}) => {
    const [formData, setFormData] = useState<any>({});
    const handleSubmit = async () => {
        try {
            const response = await fetch(REST_ENDPOINT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                throw new Error('Failed to submit form data');
            }
            // Optionally, handle successful submission (e.g., show success message)
        } catch (error) {
            console.error('Error submitting form data:', error);
            // Optionally, handle error (e.g., show error message)
        }
    };
    return (
        <div>
            {schema && (
                <>
                    <h1>JSONForms Example</h1>
                    <JsonForms
                        schema={schema}
                        data={formData}
                        renderers={materialRenderers}
                        cells={materialCells}
                        onChange={({data}) => setFormData(data)}
                    />
                    <button className={style.submitButton} onClick={handleSubmit}>Submit</button>
                </>
            )}
        </div>
    );
};

export default Form;
