import { OrderDetails } from './order-details.model';

export interface Orderinfo {
    deliverydate:    string;
    name:            string;
    email:           string;
    company:         string;
    phone:           string;
    status:          number;
    orders:          OrderDetails[];
    comments:        string;
    total:           number;
    tax:             number;
    promotion:       string;
    promotionamount: number;
    amountpaid:      number;
}
