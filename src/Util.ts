import {GRID_CONFIG} from './config';
import { HIDE_COLUMN } from './config';
export function hide(key: string): boolean {
    // @ts-ignore
    return (typeof GRID_CONFIG[key] === 'undefined' || GRID_CONFIG[key][HIDE_COLUMN] === 'undefined') ? false : GRID_CONFIG[key][HIDE_COLUMN];
}