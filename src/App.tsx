import {Admin, Resource} from 'react-admin';
import {dataProvider} from './dataProvider';
import {SampleList, SampleShow} from "./samples";
import ColorizeIcon from '@mui/icons-material/Colorize';

export const App = () => (
    <Admin
        dataProvider={dataProvider}
	>
        <Resource name="samples" list={SampleList} show={SampleShow} icon={ColorizeIcon}/>
    </Admin>
);

