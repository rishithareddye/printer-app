import { Slot } from './slot.model';

export interface SlotInfo {
    pushid?: string;
    date?:    any;
    availableslots?:   { [key: string]: number };
    maxslots?:   { [key: string]: number };
}

