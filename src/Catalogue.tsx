// Catalogue.tsx
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {AgGridReact} from 'ag-grid-react';
import {ColDef, FilterModel, IRowNode, RowValueChangedEvent, ValueGetterParams} from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import {
    AppBarProps,
    CatalogueProps,
    ColumnConfiguration,
    Config,
    Facet,
    Filter,
    FilterDataType,
    SideFilter
} from "./types";
import MuiAppBar from "@mui/material/AppBar";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MenuIcon from "@mui/icons-material/Menu";
import {
    Box,
    Button,
    Checkbox,
    Collapse,
    CssBaseline,
    Divider,
    Drawer,
    FormControl,
    IconButton,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Select,
    SelectChangeEvent,
    styled,
    Toolbar,
    Typography,
} from "@mui/material";
import {Add, Remove} from '@mui/icons-material';
import {shouldHideColumn} from './Util';
import ListCellRenderer from "./ListCellRenderer/ListCellRenderer";
import catalogueStyle from "./Catalogue.module.css";
import {ValueFormatterParams} from "ag-grid-community/dist/lib/entities/colDef";

const config = window?.appConfig as Config;

const drawerWidth = 240;
const SELECT_DUMMY_VALUE = "---none---";

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({theme, open}) => ({
    transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerHeader = styled("div")(({theme}) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
}));

const Main = styled("main", {shouldForwardProp: (prop) => prop !== "open"})<{
    open?: boolean;
}>(({theme, open}) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    }),
}));


export let facets: Facet[] = [];
let filtersToApply: Map<string, Filter> = new Map<string, Filter>();

/**
 *
 * @param colDef
 * @param data the row's data
 * @param filterDef
 */
function getCellValue<T>(colDef: ColDef<any, any>, data: any): T {
    let value;
    if (typeof colDef.valueGetter === 'function') {
        return colDef?.valueGetter({data} as ValueGetterParams) as T;
    } else {
        return data[colDef?.field as string] as T;
    }
}

const Catalogue: React.FC<CatalogueProps> = ({schema, rowData}) => {
    const [columnDefs, setColumnDefs] = useState<ColDef[]>([]);
    const gridRef = useRef<AgGridReact<any>>(null);
    const [openFilters, setOpenFilters] = React.useState({});
    const [open, setOpen] = React.useState(false);

    function formatDateTime(params: ValueFormatterParams) {
        return params.value ? new Date(params.value).toLocaleDateString() : '';
    }

    function toTitleCase(key: string) {
        return key.charAt(0).toUpperCase() + key.slice(1);
    }

    useEffect(() => {
        const newColumnDefs: ColDef[] = config.GRID_CONFIG
            .map((columnConfig: ColumnConfiguration) => {
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
                    colDef.filter = 'agDateColumnFilter';
                }
                return colDef;
            });


        const setFilters = (columnDefs: ColDef[]) => {
            facets = [];
            let filterVals: string[];
            let filterValueMap = new Map<string, number>();
            config.FILTER_FIELDS.forEach((field: SideFilter) => {
                const colDef = columnDefs.find((colDef: ColDef) => colDef.field == field.field);
                if (typeof colDef === 'undefined') {
                    console.warn(`cannot find ColDef for ${field.field}`);

                } else {
                    filterValueMap = new Map<string, number>();

                    if (field.data_type === FilterDataType.numeric_range) {

                        let rangeInterval = field.range_interval || 1000000;
                        rowData.forEach((node: any) => {
                            let value = getCellValue(colDef, node) as number;
                            if (value) {
                                let rangeStart = Math.floor(value / rangeInterval) * rangeInterval;
                                let range = rangeStart + "-" + (rangeStart + rangeInterval);
                                if (filterValueMap.has(range)) {
                                    filterValueMap.set(range, filterValueMap.get(range)! + 1);
                                } else {
                                    filterValueMap.set(range, 1);
                                }
                            }
                        });


                    } else if (field.data_type === FilterDataType.string_range) {
                        throw new Error("NOT IMPLEMENTED");
                    } else {
                        rowData.forEach((node: any) => {
                            let value = getCellValue(colDef, node) as string;
                            value = value.trim();
                            if (value) {
                                if (filterValueMap.has(value)) {
                                    filterValueMap.set(value, filterValueMap.get(value)! + 1);
                                } else {
                                    filterValueMap.set(value, 1);
                                }
                            }
                        });
                    }


                    filterVals = [];
                    if (field.type === "select") {
                        filterVals.push(SELECT_DUMMY_VALUE);
                    }
                    filterValueMap.forEach((value: number, key: string) => {
                        filterVals.push(key)
                    });
                    filterVals.sort();
                    if (filterVals) {
                        field.data_type = field.data_type || FilterDataType.string;
                        facets.push({
                            "label": field.field,
                            "type": field.type,
                            "data_type": field.data_type,
                            "options": filterVals
                        })
                    }
                }
            });
        };

        setColumnDefs(newColumnDefs);
        // FIXME amnon: passing the columnDefs as a parameter  is a quick and dirty workaround.
        setFilters(newColumnDefs);

    }, [schema]);

    const isExternalFilterPresent = useCallback((): boolean => {
        return filtersToApply.size > 0;
    }, []);


    const doesExternalFilterPass = useCallback(
        (node: IRowNode<any>): boolean => {
            let isMatched = true;
            let prevCategory = "";
            if (node.data) {
                filtersToApply.forEach((filter, filterCategory) => {
                        let record = node.data! as any;
                        if (prevCategory !== "" && prevCategory !== filterCategory && !isMatched) {
                            return false;
                        }
                        const colDef = gridRef.current?.api?.getColumnDefs()?.find((colDef: ColDef) => colDef.field == filter.label);
                        let cellValue: any;
                        if (typeof colDef === 'undefined') {
                            console.warn(`cannot find ColDef for ${filter.label}`);
                        } else {
                            cellValue = getCellValue(colDef, record);
                        }
                        if (filter.data_type === FilterDataType.numeric_range) {
                            isMatched = false;
                            filter.options.forEach((range) => {

                                if (!isMatched) {
                                    let rangeStartEnd = range.split("-");
                                    let rangeStart = rangeStartEnd[0] as unknown as number;
                                    let rangeEnd = rangeStartEnd[1] as unknown as number;
                                    if (cellValue) {
                                        let cellValueNumber = cellValue as number;
                                        if ((cellValueNumber >= rangeStart && cellValueNumber < rangeEnd)) {
                                            isMatched = true;
                                        }
                                    }
                                }
                            });

                        } else {
                            if (!filter.options.includes(cellValue as string)) {
                                isMatched = false;
                            }
                        }

                        prevCategory = filterCategory;

                    }
                );
            }
            return isMatched;
        },
        [filtersToApply]
    );

    const externalFilterChanged = (event: SelectChangeEvent<unknown>, data_type: string) => {
        if (event.target.value === SELECT_DUMMY_VALUE) {
            if (filtersToApply.has(event.target.name)) {
                filtersToApply.delete(event.target.name);
            }
        } else {
            filtersToApply.set(event.target.name, {
                label: event.target.name,
                data_type,
                options: [event.target.value as string]
            });
        }
        gridRef.current!.api.onFilterChanged();
    };


    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, data_type: string) => {
        const filterModel = gridRef.current?.api.getFilterModel() as FilterModel;

        function convertToMultiConditionFilter() {
            const firstFilter = filterModel[event.target.name];
            if (data_type === 'string') {
                filterModel[event.target.name] = {
                    filterType: 'text',
                    operator: 'OR',
                    conditions: [
                        firstFilter,
                        {
                            filter: event.target.value as string,
                            type: 'equals',
                            filterType: 'text'
                        }
                    ]
                }
            } else if (data_type === 'numeric_range') {
                const [filter, filterTo] = event.target.value.split('-');
                filterModel[event.target.name] = {
                    filterType: 'number',
                    operator: 'OR',
                    conditions: [
                        firstFilter,
                        {
                            filter,
                            filterTo,
                            type: 'inRange',
                            filterType: 'number'
                        }
                    ]
                };
            } else {
                throw Error(`unsupported filter data type: ${data_type}`)
            }
        }

        function initializeFilter() {
            if (data_type === 'string') {
                filterModel[event.target.name] = {
                    filter: event.target.value as string,
                    type: 'equals',
                    filterType: 'text'
                };
            } else if (data_type === 'numeric_range') {
                const [filter, filterTo] = event.target.value.split('-');
                filterModel[event.target.name] = {
                    filter,
                    filterTo,
                    type: 'inRange',
                    filterType: 'number'
                };
            } else {
                throw Error(`unsupported filter data type: ${data_type}`)
            }
        }

        function removeFilterCondition() {
            filterModel[event.target.name].conditions = filterModel[event.target.name].conditions.filter((c: any) => c.filter !== event.target.value)
            if (filterModel[event.target.name].conditions.length == 0) {
                delete filterModel[event.target.name];
            }
        }

        debugger;
        if (event.target.checked) {
            if (!(event.target.name in filterModel)) {
                initializeFilter();
            } else if (!('conditions' in filterModel[event.target.name])) {
                convertToMultiConditionFilter();
            }
        } else { // un-tick checkbox branch
            if ('conditions' in filterModel[event.target.name]) {
                removeFilterCondition();
            } else {
                delete filterModel[event.target.name];
            }
        }
        gridRef.current!.api.setFilterModel(filterModel);
    };
    const handleResetAll = () => {
        filtersToApply = new Map<string, Filter>();
        gridRef.current!.api.setFilterModel(null);
        setOpenFilters({});
    };

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };
    const handleToggleFilter = (filterLabel: string) => {

        setOpenFilters((prevOpenFilters) => ({
            ...prevOpenFilters,
            [filterLabel]: // @ts-ignore
                !prevOpenFilters[filterLabel]
        }));
    };

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
        <>
            <Box sx={{display: "flex"}}>

                <CssBaseline/>
                <AppBar position="fixed" open={open}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            sx={{mr: 2, ...(open && {display: "none"})}}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Typography variant="h6" noWrap component="div">
                            Data Catalogue
                        </Typography>
                    </Toolbar>
                </AppBar>


                <Drawer sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        boxSizing: "border-box",
                    },
                }}
                        variant="persistent"
                        anchor="left"
                        open={open}>

                    <DrawerHeader>
                        <IconButton onClick={handleDrawerClose}>Filters
                            <ChevronLeftIcon/>
                        </IconButton>
                    </DrawerHeader>

                    <Divider/>

                    <Box>
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            mb={2}>

                            <Button variant="text" color="primary" onClick={handleResetAll}>
                                Reset All
                            </Button>
                        </Box>

                        <List>
                            {facets.map((facet, index) => (

                                <React.Fragment key={facet.label}>
                                    <ListItem button onClick={() => handleToggleFilter(facet.label)}>
                                        <ListItemText primary={facet.label}/>
                                        {// @ts-ignore
                                            openFilters[facet.label] ? (
                                                <Remove/>
                                            ) : (
                                                <Add/>
                                            )}
                                    </ListItem>

                                    <Collapse
                                        in={
                                            // @ts-ignore
                                            openFilters[facet.label]}
                                        timeout="auto"
                                        unmountOnExit
                                    >
                                        {facet.type === "select" && (
                                            <ListItem sx={{pl: 4}}>
                                                <FormControl fullWidth>
                                                    <InputLabel id="demo-simple-select-label">{facet.label}</InputLabel>
                                                    <Select labelId="demo-simple-select-label"
                                                            id="demo-simple-select"
                                                            label={facet.label}
                                                            name={facet.label}
                                                            onChange={(event) => externalFilterChanged(event, facet.data_type)}>
                                                        {facet.options.map((option) => (
                                                            <MenuItem key={option} value={option}>
                                                                {option}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </ListItem>
                                        )}
                                        {facet.type === "checkbox" && (
                                            <List component="div" disablePadding>
                                                {facet.options.map((option: string) => (
                                                    <ListItem key={option} button sx={{pl: 4}}>
                                                        <Checkbox
                                                            onChange={(event) => handleCheckboxChange(event, facet.data_type)}
                                                            name={facet.label}
                                                            value={option}
                                                            sx={{
                                                                "&.Mui-checked": {
                                                                    color: "red"
                                                                }
                                                            }}
                                                        />
                                                        <ListItemText primary={option}/>
                                                    </ListItem>
                                                ))}
                                            </List>
                                        )}

                                    </Collapse>
                                </React.Fragment>
                            ))}
                        </List>
                    </Box>
                </Drawer>

                <Main open={open}
                      className={"ag-theme-alpine " + catalogueStyle.CatalogueGrid}
                      style={{height: '80vh', width: '100%'}}>
                    <DrawerHeader/>
                    <AgGridReact
                        rowData={rowData}
                        columnDefs={columnDefs}
                        ref={gridRef}
                        pagination={true}
                        paginationPageSize={10}
                        isExternalFilterPresent={isExternalFilterPresent}
                        doesExternalFilterPass={doesExternalFilterPass}
                    />
                </Main>

            </Box>
        </>
    );
};

export default Catalogue;
