import React from 'react';
import style from "./ListCellRenderer.module.css";
import Popover from '@mui/material/Popover';

interface MoreCellRendererState {
    anchorElement: HTMLDivElement | null;
}

export default class ListCellRenderer extends React.Component<{ value: string[] }, MoreCellRendererState> {
    constructor(props: any) {
        super(props);
        this.state = {
            anchorElement: null
        };
    }

    render() {
        let {value} = this.props;

        const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
            this.setState({anchorElement: event.currentTarget});
        };

        const handleClose = () => {
            this.setState({anchorElement: null});
        };

        const open = Boolean(this.state.anchorElement);
        const id = open ? 'simple-popover' : undefined;

        let renderedCell;
        if (!value) {
            return <div></div>
        }
        renderedCell = <div className={style.listCellWrapper}>
            <div className={style.listCellFirstItem}>
                {value[0]}
            </div>
            {value.length > 1 &&
                <div className={style.listCellButtonWrapper}>
                    <div aria-describedby={id} onClick={handleClick} className={style.listCellButton}>
                        +{value.length - 1} more
                    </div>
                    <Popover
                        id={id}
                        open={open}
                        anchorEl={this.state.anchorElement}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        className={style.listCellPopper}
                    >
                        <div className={style.listCellPopoverTitle}>{value.length} values</div>
                        <div className={style.listCellPopoverValues}>{value.map((val => <div
                            className={style.listCellPopoverValue}
                            key={val}>{val}</div>))}</div>
                    </Popover>
                </div>}
        </div>;

        return (
            <div>
                {renderedCell}
            </div>
        );
    }
}
