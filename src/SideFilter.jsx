import * as React from "react";
import {fetchCatalogueData} from './api';
import {useEffect, useState, useRef} from "react";
import {
    Autocomplete,
    Box,
    Button,
    Collapse,
    Divider,
    FormControl,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    Select,
    TextField
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { filters, gridApi } from './Catalogue';
import { filterCatalogueData } from './api';


//filters format
//{
//                     "label": 'field name',
//                     "options": value array
//                 }


export const SideFilter = (props) => {
    
    const [openFilters, setOpenFilters] = React.useState({});
    const [filterValues, setFilterValues] = React.useState({});

    
    

    const handleToggleFilter = (filterLabel) => {
        setOpenFilters((prevOpenFilters) => ({
            ...prevOpenFilters,
            [filterLabel]: !prevOpenFilters[filterLabel]
        }));
    };

    const handleAutocompleteChange = (event, value, filterLabel) => {
        setFilterValues((prevFilterValues) => ({
            ...prevFilterValues,
            [filterLabel]: value
        }));
    };

    const handleResetAll = () => {
        setOpenFilters({});
        setFilterValues({});
    };

    const applyFilters = () => {

        console.log("Filtered data call:")
            try {
                const documents =  fetchCatalogueData();
                console.log("Filtered data:"+documents)
                props.api.setRowData(documents);

            } catch (error) {
                console.error('Error fetching catalogue data:', error);
            }
        
        
    };

    return (
        <Box sx={{ bgcolor: "#F5F5F5", width: "212px", p: "24px" }}>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
            >
                <Box fontSize="h6.fontSize" fontWeight="bold">
                    Filters
                </Box>
                <Button variant="text" color="primary" onClick={handleResetAll}>
                    Reset All
                </Button>
            </Box>
            <List>
                {filters.map((filter, index) => (
                    <React.Fragment key={filter.label}>
                        <ListItem button onClick={() => handleToggleFilter(filter.label)}>
                            <ListItemText primary={filter.label} />

                            {
                                openFilters[filter.label] ? (<Remove />) : (<Add  />)
                            }
                        </ListItem>
                        <Collapse in={openFilters[filter.label]} timeout="auto" unmountOnExit>

                                <ListItem sx={{ pl: 4 }}>
                                    <Autocomplete
                                        options={filter.options}
                                        renderInput={(params) => (
                                            <TextField {...params} label={filter.label} fullWidth />
                                        )}
                                        onChange={(event, value) =>
                                            handleAutocompleteChange(event, value, filter.label)
                                        }
                                        sx={{
                                            width: "100%",
                                            "& .MuiOutlinedInput-root": {
                                                border: "none"
                                            }
                                        }}
                                    />
                                </ListItem>

                        </Collapse>
                        {index < filters.length - 1 && <Divider />}
                    </React.Fragment>
                ))}
            </List>

            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} >
                <Button variant="contained"  onClick={applyFilters}>
                    Apply Filters
                </Button>
            </Box>

        </Box>
    );
};
