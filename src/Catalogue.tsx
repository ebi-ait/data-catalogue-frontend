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
import {
    Box,
    FormControl,
    InputLabel,
    ListItem,
    MenuItem,
    Select,
    SelectChangeEvent
} from "@mui/material";
import {Add, Remove } from '@mui/icons-material';


interface CatalogueProps {
    schema: any;
}
export interface Filter {
    label: string;
    options: string[]
}



export let facets: Filter[] = [];
let filtersToApply:Map<string, Filter> = new Map<string, Filter>();

const Catalogue: React.FC<CatalogueProps> = ({schema}) => {
    const [rowData, setRowData] = useState<any[]>([]);
    const [filterData, setFilterData] = useState<any[]>([]);
    const [columnDefs, setColumnDefs] = useState<ColDef[]>([]);
    const gridRef = useRef<AgGridReact<any>>(null);

    const [openFilters, setOpenFilters] = React.useState({});

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
            facets  = [];
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
                    facets.push({
                        "label": field.field,
                        "options": filterValues
                    })
                }
            });
        };
        setFilters();

    }, [schema]);



    const isExternalFilterPresent = useCallback((): boolean => {
        return filtersToApply.size > 0;
    }, []);

     const doesExternalFilterPass = useCallback(
         (node: IRowNode<any>): boolean => {
             // now handling the case when already selected filter changed
             let filterPass = false;
             if (node.data) {
                     filtersToApply.forEach((filter, filterLabel) => {
                         if(filterPass) {
                            return true;
                         }
                         let record = node.data! as any;
                         /*console.log(record[filter.label] +":filter.options.includes(record[filter.label] as string)"
                             +filter.options.includes(record[filter.label] as string))*/
                         filterPass = filter.options.includes(record[filter.label] as string);

                     }
                 );
             }
             return filterPass;
         },
         [filtersToApply]
     );



    const externalFilterChanged = (event: SelectChangeEvent) => {
        filtersToApply.set(event.target.name, {label:event.target.name,options:[event.target.value as string]});
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
            <Box sx={{ bgcolor: "#F5F5F5", width: "212px", p: "24px" }}>

                    <FormControl fullWidth >
                        { facets.map((facet, index) => (
                            <>
                                    <ListItem sx={{ pl: 4 }} >
                                        <InputLabel id="demo-simple-select-label">{facet.label}</InputLabel>
                                        <Select labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            label={facet.label}
                                            name={facet.label}
                                            onChange={externalFilterChanged} >
                                            {facet.options.map((option) => (
                                                <MenuItem  key={option} value={option}>
                                                    {option}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                     </ListItem>
                            </>
                     )) }
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
