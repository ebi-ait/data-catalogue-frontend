// Catalogue.tsx
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {AgGridReact} from 'ag-grid-react';
import {ColDef, IRowNode, RowValueChangedEvent} from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import {fetchCatalogueData} from './api';
import {REST_ENDPOINT_URL} from "./config";
import {FILTER_FIELDS} from "./config";
import {JsonSchema7 } from '@jsonforms/core';
import { SideFilter } from './SideFilter';
import Stack from "@mui/material/Stack";
import {Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';


interface CatalogueProps {
    schema: any;
}
export interface Filter {
    label: string;
    options: string[]
}



export let filters: Filter[] = [];
const Catalogue: React.FC<CatalogueProps> = ({schema}) => {
    const [rowData, setRowData] = useState<any[]>([]);
    const [filterData, setFilterData] = useState<any[]>([]);
    const [columnDefs, setColumnDefs] = useState<ColDef[]>([]);
    const gridRef = useRef<AgGridReact<any>>(null);
    let filter:Filter = {label:'', options:[]};


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
        const setFilters = () => {
            filters  = [];
            let filterValues: string[];
            let filterValueMap = new Map<string, number>();

            FILTER_FIELDS.forEach(field => {
                //value for a single title(filter) with count
                filterValueMap = new Map<string, number>();
                rowData.forEach(node => {
                    let value = node[field.field] as string;
                    value = value.trim();
                    if (value) {
                        if (filterValueMap.has(value)) {
                            filterValueMap.set(value, filterValueMap.get(value)! + 1);
                        } else {
                            filterValueMap.set(value, 1);
                        }
                    }
                });

                filterValues = [];
                filterValueMap.forEach((value: number, key: string) => {
                    filterValues.push(key)
                });

                //TODO iterate filterValueMap and set filterValues
                // @ts-ignore
                if(filterValues) {
                    filters.push({
                        "label": field.field,
                        "options": filterValues
                    })
                }
            });
        };
        setFilters();

    }, [schema]);



    const isExternalFilterPresent = useCallback((): boolean => {
        return filter.label!='';
    }, []);

     const doesExternalFilterPass = useCallback(
         (node: IRowNode<any>): boolean => {
             if (node.data) {
                 return (node.data.acronym== filter.options[0]);

             }
             return true;
         },
         [filter]
     );



    const externalFilterChanged = (event: SelectChangeEvent) => {
        debugger

        filter= {label:'acronym',options:[event.target.value as string]};
        gridRef.current!.api.onFilterChanged();
    };
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
        <Stack direction="row" sx={{ gap: 3 }}>
            <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Age</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="acronym"
                    onChange= {externalFilterChanged}
                >
                    <MenuItem value={'sts'}>sts</MenuItem>
                    <MenuItem value={'newTestA'}>newTestA</MenuItem>
                </Select>
            </FormControl>
            </Box>
        <div className="ag-theme-alpine" style={{height: '500px', width: '100%'}}>
            <AgGridReact
                rowData={rowData}
                columnDefs={columnDefs}
                ref={gridRef}
                pagination={true}
                paginationPageSize={10}
                editType={'fullRow'}
                sideBar={true}
                isExternalFilterPresent={isExternalFilterPresent}
                doesExternalFilterPass={doesExternalFilterPass}
                onRowValueChanged={handleRowValueChanged}

            />
        </div>
        </Stack>
    );
};

export default Catalogue;
