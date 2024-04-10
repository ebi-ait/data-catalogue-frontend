import {
    ArrayField,
    ChipField,
    Datagrid,
    DateField, FilterList, FilterListItem, FilterLiveSearch,
    List,
    ReferenceField, ReferenceInput, SavedQueriesList,
    Show, SimpleShowLayout,
    SingleFieldList,
    TextField, TextInput
} from 'react-admin';
import React from "react";
import { Card, CardContent } from '@mui/material';
import FieldValuesFilter from "./FieldValuesFilter";



export const FilterSidebar = () => (
    <Card sx={{ order: -1, mr: 2, mt: 9}}>
        <CardContent>
            <FieldValuesFilter column="accession"/>
        </CardContent>
    </Card>
);
export const SampleList = () => (
    <List aside={<FilterSidebar/>}>
        <Datagrid rowClick="show">
            <TextField source="name"/>
            <TextField source="accession" />
            <DateField source="release" />
            <ArrayField source="characteristics.center" label="Center">
                <SingleFieldList  linkType={false}><TextField source="text" /></SingleFieldList>
            </ArrayField>
            <ArrayField source="characteristics.time point" label="Time Point">< SingleFieldList linkType={false}><TextField source="text" /></SingleFieldList></ArrayField>
            <ArrayField source="characteristics.organism" label="Organism"> <SingleFieldList linkType={false}><TextField source="text" /></SingleFieldList></ArrayField>
            <ArrayField source="characteristics.biome" label="Biome"> <SingleFieldList linkType={false}><TextField source="text" /></SingleFieldList></ArrayField>
            <ArrayField source="characteristics.freezing method" label="Freezing Method"> <SingleFieldList linkType={false}><TextField source="text" /></SingleFieldList></ArrayField>
            <ArrayField source="characteristics.cultivation" label="Cultivation"> <SingleFieldList linkType={false}><TextField source="text" /></SingleFieldList></ArrayField>
            <ArrayField source="characteristics.cryoprotectant" label="Cryoprotectant"> <SingleFieldList linkType={false}><TextField source="text" /></SingleFieldList></ArrayField>
            <ArrayField source="characteristics.soil type" label="Soil Type"> <SingleFieldList linkType={false}><TextField source="text" /></SingleFieldList></ArrayField>
            <ArrayField source="characteristics.preservation temperature" label="Preservation Temperature"> <SingleFieldList linkType={false}><TextField source="text" /></SingleFieldList></ArrayField>
            <ArrayField source="characteristics.broad-scale environmental context" label="Broad-scale Environmental Context"> <SingleFieldList linkType={false}><TextField source="text" /></SingleFieldList></ArrayField>
            <ArrayField source="characteristics.environmental medium" label="Environmental Medium"> <SingleFieldList linkType={false}><TextField source="text" /></SingleFieldList></ArrayField>
            <ArrayField source="characteristics.geographic location (region and locality)" label="Geographic Location (region and locality)"> <SingleFieldList linkType={false}><TextField source="text" /></SingleFieldList></ArrayField>
            <ArrayField source="characteristics.geographic location (country and/or sea)" label="Geographic Location (country and/or sea)"> <SingleFieldList linkType={false}><TextField source="text" /></SingleFieldList></ArrayField>
            <ArrayField source="characteristics.analysis date" label="Analysis Date"> <SingleFieldList linkType={false}><DateField source="text" /></SingleFieldList></ArrayField>
            <ArrayField source="characteristics.pH" label="pH"><SingleFieldList><DateField source="text" /></SingleFieldList></ArrayField>
        </Datagrid>
    </List>
);


export const SampleShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="name" />
            <TextField source="accession" />
            <TextField source="sraAccession" />
            <TextField source="webinSubmissionAccountId" />
            <TextField source="taxId"  />
            <TextField source="status" />
            <DateField source="release" />
            <DateField source="update" />
            <DateField source="submitted" />
            <ArrayField source="relationships"><Datagrid><TextField source="source" />
                <TextField source="type" />
                <TextField source="target" /></Datagrid></ArrayField>
            <TextField source="submittedVia" />
            <DateField source="create" />
        </SimpleShowLayout>
    </Show>
);
