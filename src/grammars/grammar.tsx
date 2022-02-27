import {Record} from "react-admin";

export interface Grammar extends Record {
    name: string;
    grammar: string;
    terminal_symbols: string;
    nonterminal_symbols: string;
    production_rules: string;
    start_symbol: string;
}