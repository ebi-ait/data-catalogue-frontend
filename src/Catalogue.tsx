// Catalogue.tsx
import React, {useEffect, useState} from 'react';
import {AgGridReact} from 'ag-grid-react';
import {ColDef, RowValueChangedEvent} from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import {fetchCatalogueData} from './api';
import {REST_ENDPOINT_URL} from "./config";
import {JsonSchema7 } from '@jsonforms/core';
import MoreCellRenderer from "./MoreCellRenderer/MoreCellRenderer";


interface CatalogueProps {
    schema: any;
}

const Catalogue: React.FC<CatalogueProps> = ({schema}) => {
    const [rowData, setRowData] = useState<any[]>([]);
    const [columnDefs, setColumnDefs] = useState<ColDef[]>([]);

    useEffect(() => {
        const newColumnDefs: ColDef[] = schema ? Object.entries(schema.properties)
            .map(([key,propertyDef]:[string, any]) => {
                let colDef: ColDef = {
                    headerName: key.charAt(0).toUpperCase() + key.slice(1),
                    field: key,
                    editable: true
                };
                if(propertyDef.type === "array" && propertyDef.items?.type==='string') {
                    colDef.valueParser = params=> {
                        console.log(params.newValue)
                        return params.newValue.split(',');
                    };
                    colDef.cellRenderer = MoreCellRenderer;
                }
                return colDef;
            }) : [];
        setColumnDefs(newColumnDefs);

        const fetchData = async () => {
            try {
                const documents = await fetchCatalogueData();
                setRowData(documents);
            } catch (error) {
                console.error('Error fetching catalogue data:', error);
            }
        };
        fetchData();
    }, [schema]);
    const handleRowValueChanged = async (event: RowValueChangedEvent) => {
        try {
            console.log(`event data: ${JSON.stringify(event.data)}`)
            const {data} = event;
            const id = data._id; // Assuming _id is the unique identifier for each document
            const response = await fetch(`${REST_ENDPOINT_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error('Failed to update document');
            }
            // Optionally, handle successful update (e.g., show success message)
        } catch (error) {
            console.error('Error updating document:', error);
            // Optionally, handle error (e.g., show error message)
        }
    };
    return (
        <div className="ag-theme-alpine" style={{height: '500px', width: '100%'}}>
            <AgGridReact
                rowData={rowData}
                columnDefs={columnDefs}
                pagination={true}
                paginationPageSize={10}
                editType={'fullRow'}
                onRowValueChanged={handleRowValueChanged}

            />
        </div>
    );
};

export default Catalogue;
