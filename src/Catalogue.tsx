// Catalogue.tsx
import React, {useEffect, useState} from 'react';
import {AgGridReact} from 'ag-grid-react';
import {ColDef, RowValueChangedEvent} from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import {fetchCatalogueData} from './api';
import {shouldHideColumn} from './Util';
import ListCellRenderer from "./ListCellRenderer/ListCellRenderer";
import catalogueStyle from "./Catalogue.module.css";
import {ColumnConfiguration} from "./types";
import {ValueFormatterParams} from "ag-grid-community/dist/lib/entities/colDef";

const config = window?.appConfig


interface CatalogueProps {
    schema: any;
}

const Catalogue: React.FC<CatalogueProps> = ({schema}) => {
    const [rowData, setRowData] = useState<any[]>([]);
    const [columnDefs, setColumnDefs] = useState<ColDef[]>([]);
    const fieldConfMap = {};


    function formatDateTime(params: ValueFormatterParams) {
        return params.value ? new Date(params.value).toLocaleDateString() : '';
    }
    function toTitleCase(key: string) {
        return key.charAt(0).toUpperCase() + key.slice(1);
    }
    useEffect(() => {
        const newColumnDefs: ColDef[] = config.GRID_CONFIG.map((columnConfig:ColumnConfiguration)=>{
            let propertyDef = schema.properties[columnConfig.name]
            let colDef: ColDef = {
                headerName: toTitleCase(columnConfig.name),
                field: columnConfig?.field ?? columnConfig.name,
                editable: true,
                hide: shouldHideColumn(columnConfig.name),
                filter: true,
            };
            if ('valueGetter' in columnConfig) {
                colDef.valueGetter = columnConfig.valueGetter;
            }
            if (propertyDef?.type === 'array' && propertyDef?.items?.type === 'string') {
                colDef.cellRenderer = ListCellRenderer;
            }
            if (propertyDef?.type === 'string' && propertyDef?.format === "date-time") {
                colDef.valueFormatter = formatDateTime;
                colDef.filter= 'agDateColumnFilter';
            }
            return colDef;
        });
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
            const response = await fetch(`${config.REST_ENDPOINT_URL}/${id}`, {
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
        <div className={"ag-theme-alpine " +  catalogueStyle.CatalogueGrid}
             style={{height: '500px', width: '100%'}}>
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
