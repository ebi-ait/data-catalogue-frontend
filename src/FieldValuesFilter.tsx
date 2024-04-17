// CustomFilter.js

import FilterAltIcon from '@mui/icons-material/FilterAlt';
import React, {useEffect, useState} from 'react';
import {FilterList, FilterListItem, GetListParams, useDataProvider, useResourceContext} from 'react-admin';


const FieldValuesFilter = (props) => {
    let {column, valueGetter} = props;
    const [columnValues, setColumnValues] = useState([]);
    const dataProvider = useDataProvider();
    const resource = useResourceContext();

    const isSelected = (value, filters) => {
        const [selectedKey, selectedValue] = Object.entries(value)[0];
        return filters?.[selectedKey] == selectedValue
    };
    const toggleFilter = (value, filters) => {
        const [selectedKey, selectedValue] = Object.entries(value)[0];
        if (selectedKey in filters) {
            if (filters?.[selectedKey].find((v)=>v === selectedValue)) {
                filters[selectedKey] = filters[selectedKey].filter((v)=>v!==selectedValue)
                if(filters[selectedKey].length==0) {
                    delete filters[selectedKey];
                }
            } else {
                filters[selectedKey].push(selectedValue)
            }
        } else {
            filters[selectedKey] = [selectedValue]
        }
        return filters;
    };

    useEffect(() => {
        const fetchColumnValues = async () => {
            try {
                const {data} = await dataProvider.getList(resource, {
                    pagination: {page: 1, perPage: 200},
                    sort: {field: 'id', order: 'ASC'},
                } as GetListParams);
                const distinctValues:string[] = [...new Set(data.map(item => (valueGetter?.(item) ?? item[column])))].sort();
                setColumnValues(distinctValues);
            } catch (error) {
                console.error('Error fetching column values:', error);
            }
        };

        fetchColumnValues();
    }, [dataProvider, props.column, props.resource]);
    return (
        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            <FilterList label={props.column} icon={<FilterAltIcon/>}>
                {columnValues.map(value => (
                    // TODO allow multiple selection
                    <FilterListItem
                        label={value}
                        key={value}
                        value={Object.fromEntries([[column, value]])}
                        isSelected={isSelected}
                        toggleFilter={toggleFilter}
                    />
                ))}
            </FilterList>
        </div>
    );
};

export default FieldValuesFilter;
