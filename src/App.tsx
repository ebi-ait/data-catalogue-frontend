// App.tsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Form from './Form';
import Catalogue from './Catalogue';
import { fetchSchema } from './api';

const App: React.FC = () => {
    const [schema, setSchema] = useState<any>(null);

    useEffect(() => {
        const loadSchema = async () => {
            try {
                const schemaData = await fetchSchema();
                setSchema(schemaData);
            } catch (error) {
                console.error('Error loading schema:', error);
            }
        };
        loadSchema();
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Form schema={schema} />} />
                <Route path="/catalogue" element={<Catalogue schema={schema} />} />
            </Routes>
        </Router>
    );
};

export default App;
