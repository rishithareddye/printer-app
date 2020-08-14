import { Orderinfo } from './orderinfo.model';

export interface Order {
    pushid?:     string;
    orderinfo:  Orderinfo;
    created:    string;
    createdby:  string;
    modified:   string;
    modifiedby: string;
}