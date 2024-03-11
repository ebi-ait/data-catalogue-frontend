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
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuIcon from "@mui/icons-material/Menu";
import {
    Box,
    Button,
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
    useTheme
} from "@mui/material";
import {Add, Remove } from '@mui/icons-material';
import { shouldHideColumn } from './Util';
import ListCellRenderer from "./ListCellRenderer/ListCellRenderer";
import catalogueStyle from "./Catalogue.module.css";

interface CatalogueProps {
    schema: any;
}
export interface Filter {
    label: string;
    options: string[]
}

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
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

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
}));

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
    open?: boolean;
}>(({ theme, open }) => ({
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


export let facets: Filter[] = [];
let filtersToApply:Map<string, Filter> = new Map<string, Filter>();

const Catalogue: React.FC<CatalogueProps> = ({schema}) => {
    const [rowData, setRowData] = useState<any[]>([]);
    const [filterData, setFilterData] = useState<any[]>([]);
    const [columnDefs, setColumnDefs] = useState<ColDef[]>([]);
    const gridRef = useRef<AgGridReact<any>>(null);
    const fieldConfMap = {};
    const [openFilters, setOpenFilters] = React.useState({});
    const [filterValues, setFilterValues] = React.useState({});

    const theme = useTheme();
    const [open, setOpen] = React.useState(false);



    useEffect(() => {
        const newColumnDefs: ColDef[] = schema ? Object.entries(schema.properties)
            .map(([key,propertyDef]:[string, any]) => {
                let colDef: ColDef = {
                    headerName: key.charAt(0).toUpperCase() + key.slice(1),
                    field: key,
                    editable: true,
                    filter: true,
                    hide: shouldHideColumn(key)
                };
                if (propertyDef.type === "array" && propertyDef.items?.type === 'string') {
                    colDef.cellRenderer = ListCellRenderer;
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

             let filterPass = true;
             if (node.data) {
                     filtersToApply.forEach((filter, filterLabel) => {
                         let record = node.data! as any;
                         /*console.log(record[filter.label] +":filter.options.includes(record[filter.label] as string)"
                             +filter.options.includes(record[filter.label] as string))*/
                         if(!filter.options.includes(record[filter.label] as string)) {
                             filterPass = false;
                         }
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

    const handleResetAll = () => {
        filtersToApply =  new Map<string, Filter>();
        gridRef.current!.api.onFilterChanged();
        setOpenFilters({});
        setFilterValues({});
    };



    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };
    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };
    const handleToggleFilter = (filterLabel:string) => {

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
    // @ts-ignore

    return (
        <>
            <Box sx={{ display: "flex" }}>

            <CssBaseline />
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{ mr: 2, ...(open && { display: "none" }) }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        Data Catalogue
                    </Typography>
                </Toolbar>
            </AppBar>


            <Drawer  sx={{
                width: drawerWidth,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: drawerWidth,
                    boxSizing: "border-box",
                },
            }}
                     variant="persistent"
                     anchor="left"
                     open={open} >


                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>Filters
                            <ChevronLeftIcon />
                    </IconButton>
                </DrawerHeader>

                <Divider />


                <Box >

                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={2}
                    >

                        <Button variant="text" color="primary" onClick={handleResetAll}>
                            Reset All
                        </Button>
                    </Box>

                    <List>
                            { facets.map((facet, index) => (

                                    <React.Fragment key={facet.label}>

                                        <ListItem button onClick={() => handleToggleFilter(facet.label)}>
                                            <ListItemText primary={facet.label} />
                                            {// @ts-ignore
                                                openFilters[facet.label] ? (
                                                <Remove  />
                                            ) : (
                                                <Add  />
                                            )}
                                        </ListItem>

                                        <Collapse
                                            in={
                                                // @ts-ignore
                                            openFilters[facet.label] }
                                            timeout="auto"
                                            unmountOnExit
                                        >
                                        <ListItem sx={{ pl: 4 }} >
                                            <FormControl fullWidth>
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
                                            </FormControl>
                                         </ListItem>
                                        </Collapse>
                                    </React.Fragment>

                         )) }
                        </List>

                </Box>
            </Drawer>

                <Main open={open} className={"ag-theme-alpine " +  catalogueStyle.CatalogueGrid}
                      style={{height: '500px', width: '100%'}} >
                    <DrawerHeader />
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
                </Main>

            </Box>
        </>
    );
};

export default Catalogue;
