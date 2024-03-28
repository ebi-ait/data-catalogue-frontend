// App.tsx
import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Catalogue from './Catalogue';
import {fetchCatalogueData, fetchSchema} from './api';

const config = window?.appConfig;

const App: React.FC = () => {
    const [schema, setSchema] = useState<any>(null);
    const [rowData, setRowData] = useState<any[]>([]);

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

        const fetchData = async () => {
            try {
                const documents = await fetchCatalogueData();
                setRowData(documents);
            } catch (error) {
                console.error('Error fetching catalogue data:', error);
            }
        };
        fetchData();
    }, []);

    return (

        ((schema && rowData.length>0) ?
                <Router basename={config.basename}>
                    <Routes>
                        <Route path="/" element={<Catalogue schema={schema}
                                                            rowData={rowData}/>}/>
                    </Routes>
                </Router>
                : <div>Loading...</div>
        )
    );
};

export default App;
