import {ColumnConfiguration} from "./types";

const config = window?.appConfig;

export function shouldHideColumn(column: string) {
    return config.GRID_CONFIG
        .find((c:ColumnConfiguration)=> c.name===column)  // find matching column
        ?.hide // safely read the hide property
        ?? false; // default
}
