import React from 'react';
import style from "./MoreCellRenderer.module.css";
import Popover from '@mui/material/Popover';

interface MyState {
    anchorEl: HTMLDivElement | null;
}

export default class MoreCellRenderer extends React.Component<{ value: string[] }, MyState> {
    constructor(props: any) {
        super(props);
        this.state = {
            anchorEl: null
        };
    }

    render() {
        let {value} = this.props;

        const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
            this.setState({anchorEl: event.currentTarget});
        };

        const handleClose = () => {
            this.setState({anchorEl: null});
        };

        const open = Boolean(this.state.anchorEl);
        const id = open ? 'simple-popover' : undefined;

        let renderedCell;
        if (!value) {
            return <div></div>
        }
        renderedCell = <div className={style.MoreCellWrapper}>
            <div className={style.MoreCellFirstItem}>
                {value[0]}
            </div>
            {value.length > 1 &&
                <div className={style.MoreCellButtonWrapper}>
                    <div aria-describedby={id} onClick={handleClick} className={style.MoreButton}>
                        +{value.length - 1} more
                    </div>
                    <Popover
                        id={id}
                        open={open}
                        anchorEl={this.state.anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        className={style.MorePopper}
                    >
                        <div className={style.MorePopoverTitle}>{value.length} values</div>
                        <div className={style.MorePopoverValues}>{value.map((val => <div
                            className={style.MorePopoverValue}
                            key={val}>{val}</div>))}</div>
                    </Popover></div>}
        </div>;

        return (
            <div>
                {renderedCell}
            </div>
        );
    }
}
