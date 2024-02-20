import {GRID_CUSTOM_CONFIG} from './config';
export function hide(key: string): boolean {
    // @ts-ignore
    return (typeof GRID_CUSTOM_CONFIG[key] === 'undefined' || GRID_CUSTOM_CONFIG[key]['hide'] === 'undefined') ? false : GRID_CUSTOM_CONFIG[key]['hide'];
}