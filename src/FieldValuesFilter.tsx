// CustomFilter.js

import React, {useEffect, useState} from 'react';
import {Filter, FilterList, FilterListItem, GetListParams, useDataProvider, useResourceContext} from 'react-admin';


const FieldValuesFilter = (props) => {
    const [columnValues, setColumnValues] = useState([]);
    const dataProvider = useDataProvider();
    const resource = useResourceContext();
    useEffect(() => {
        const fetchColumnValues = async () => {
            try {
                const {data} = await dataProvider.getList(resource, {
                    pagination: {page: 1, perPage: 200}, // Adjust pagination as needed
                    sort: {field: props.column, order: 'ASC'},
                } as GetListParams);
                const distinctValues = [...new Set(data.map(item => {
                    // TODO get nested properties as well
                    return item[props.column];
                }))];
                setColumnValues(distinctValues);
            } catch (error) {
                console.error('Error fetching column values:', error);
            }
        };

        fetchColumnValues();
    }, [dataProvider, props.column, props.resource]);

    return (
        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            <FilterList label={props.column} {...props}>
                {columnValues.map(value => (
                    <FilterListItem
                        label={value}
                        key={value}
                        value={{
                            field:props.column,
                            value
                        }}
                    />
                ))}
            </FilterList>
        </div>
    );
};

export default FieldValuesFilter;
