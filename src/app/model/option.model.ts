export interface Option {
    optionid:    string;
    serviceid:   string;
    name:        string;
    assets:      string[];
    description: string;
    cost:        number;
    mincount:    number;
    maxcount:    number;
}
