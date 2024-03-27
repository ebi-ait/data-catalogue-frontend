// App.tsx
import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Catalogue from './Catalogue';
import {fetchSchema} from './api';

const config = window?.appConfig;

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
        (schema ?
                <Router basename={config.basename}>
                    <Routes>
                        <Route path="/" element={<Catalogue schema={schema}/>}/>
                    </Routes>
                </Router>
                : <div>Loading...</div>
        )
    );
};

export default App;
