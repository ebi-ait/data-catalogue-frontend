import {
    ArrayField,
    Datagrid,
    DateField, Filter,
    FilterLiveSearch,
    List, Pagination, SelectArrayInput,
    Show,
    SimpleShowLayout,
    SingleFieldList,
    TextField
} from 'react-admin';
import React from "react";
import {Card, CardContent} from '@mui/material';
import FieldValuesFilter from "./FieldValuesFilter";


export const FilterSidebar = () => (
    <Card sx={{ order: -1}}>
        <CardContent>
            <FilterLiveSearch />
            <FieldValuesFilter column="characteristics.soil type" valueGetter={(data)=>data.characteristics?.["soil type"]?.[0]?.text}/>
            <FieldValuesFilter column="characteristics.organism" valueGetter={(data)=>data.characteristics?.organism?.[0]?.text}/>
            <FieldValuesFilter column="characteristics.cultivation" valueGetter={(data)=>data.characteristics?.cultivation?.[0]?.text}/>
            <FieldValuesFilter column="characteristics.time point" valueGetter={(data)=>data.characteristics?.["time point"]?.[0]?.text}/>
            <FieldValuesFilter column="characteristics.cryoprotectant" valueGetter={(data)=>data.characteristics?.cryoprotectant?.[0]?.text}/>
            <FieldValuesFilter column="characteristics.freezing method" valueGetter={(data)=>data.characteristics?.["freezing method"]?.[0]?.text}/>

        </CardContent>
    </Card>
);
export const SampleList = () => {
    return (
        <List
            aside={<FilterSidebar/>}
        >
            <Datagrid rowClick="show">
                <TextField source="name"/>
                <TextField source="accession"/>
                <DateField source="release"/>
                <ArrayField source="characteristics.center" label="Center">
                    <SingleFieldList linkType={false}><TextField source="text"/></SingleFieldList>
                </ArrayField>
                <ArrayField source="characteristics.time point" label="Time Point">< SingleFieldList
                    linkType={false}><TextField source="text"/></SingleFieldList></ArrayField>
                <ArrayField source="characteristics.organism" label="Organism"> <SingleFieldList
                    linkType={false}><TextField source="text"/></SingleFieldList></ArrayField>
                <ArrayField source="characteristics.biome" label="Biome"> <SingleFieldList linkType={false}><TextField
                    source="text"/></SingleFieldList></ArrayField>
                <ArrayField source="characteristics.freezing method" label="Freezing Method"> <SingleFieldList
                    linkType={false}><TextField source="text"/></SingleFieldList></ArrayField>
                <ArrayField source="characteristics.cultivation" label="Cultivation"> <SingleFieldList linkType={false}><TextField
                    source="text"/></SingleFieldList></ArrayField>
                <ArrayField source="characteristics.cryoprotectant" label="Cryoprotectant"> <SingleFieldList
                    linkType={false}><TextField source="text"/></SingleFieldList></ArrayField>
                <ArrayField source="characteristics.soil type" label="Soil Type"> <SingleFieldList
                    linkType={false}><TextField source="text"/></SingleFieldList></ArrayField>
                <ArrayField source="characteristics.preservation temperature" label="Preservation Temperature">
                    <SingleFieldList linkType={false}><TextField source="text"/></SingleFieldList></ArrayField>
                <ArrayField source="characteristics.broad-scale environmental context"
                            label="Broad-scale Environmental Context"> <SingleFieldList linkType={false}><TextField
                    source="text"/></SingleFieldList></ArrayField>
                <ArrayField source="characteristics.environmental medium" label="Environmental Medium"> <SingleFieldList
                    linkType={false}><TextField source="text"/></SingleFieldList></ArrayField>
                <ArrayField source="characteristics.geographic location (region and locality)"
                            label="Geographic Location (region and locality)"> <SingleFieldList
                    linkType={false}><TextField source="text"/></SingleFieldList></ArrayField>
                <ArrayField source="characteristics.geographic location (country and/or sea)"
                            label="Geographic Location (country and/or sea)"> <SingleFieldList
                    linkType={false}><TextField source="text"/></SingleFieldList></ArrayField>
                <ArrayField source="characteristics.analysis date" label="Analysis Date"> <SingleFieldList
                    linkType={false}><DateField source="text"/></SingleFieldList></ArrayField>
                <ArrayField source="characteristics.pH" label="pH"><SingleFieldList><DateField
                    source="text"/></SingleFieldList></ArrayField>
            </Datagrid>
        </List>
    );
};


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
