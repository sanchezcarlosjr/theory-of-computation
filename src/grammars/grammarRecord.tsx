import {Record} from "react-admin";

export interface GrammarRecord extends Record {
    name: string;
    grammar: string; // Latex Grammar Syntax
    terminal_symbols: string;
    nonterminal_symbols: string;
    production_rules: string;
    start_symbol: string;
}