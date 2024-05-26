import {ILink} from './ILink'

export interface IUnrecRegion {
    id: string;
    name: string;
    name_ru: string;
    flag: string | null;
    flag_cc: string | null;
    description: string;
    description_ru: string;
    links: ILink[];
    links_ru: ILink[];
}