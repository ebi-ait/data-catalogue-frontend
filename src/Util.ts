import {GRID_CONFIG} from './config';

export function shouldHideColumn(column: string): boolean {
    return GRID_CONFIG
        .find(c=> c.name===column)  // find matching column
        ?.hide // safely read the hide property
        ?? false; // default
}
