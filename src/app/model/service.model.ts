import { Option } from './option.model';

export interface Service {
    pushid?:      string;
    id:          string;
    description: string;
    name:        string;
    options:     Option[];
    assets:      string[];
}
