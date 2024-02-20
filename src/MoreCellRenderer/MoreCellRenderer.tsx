import React from 'react';
import style from "./MoreCellRenderer.module.css";


import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function MoreCellRenderer({cellValues}: { cellValues: string[] }) {
    const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    let renderedCell;
    // if (cellValues.length > 1) {
    renderedCell = <div className={style.MoreCellWrapper}>
        <div className={style.MoreCellFirstItem}>
            {cellValues[0]}
        </div>
        {cellValues.length > 1 &&
            <div className={style.MoreCellButtonWrapper}>
                <div aria-describedby={id} onClick={handleClick} className={style.MoreButton}>
                    +{cellValues.length - 1} more
                </div>
                <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    className={style.MorePopper}
                >
                    {/*<Typography sx={{p: 2}}>The content of the Popover.</Typography>*/}
                    {/*<div>{cellValues.map((val => <Typography sx={{p: 2}}>{val}</Typography>))}</div>*/}
                    <div className={style.MorePopoverTitle}>{cellValues.length} values</div>
                    <div className={style.MorePopoverValue}>{cellValues.map((val => <div key={val}>{val}</div>))}</div>
                </Popover></div>}
    </div>;
    // } else {
    //     renderedCell = <div aria-describedby={id} onClick={handleClick} className={style.MoreCell}>
    //         {cellValues.join(', ')} single
    //     </div>
    // }

    return (
        <div>
            {renderedCell}
        </div>
    );
}
