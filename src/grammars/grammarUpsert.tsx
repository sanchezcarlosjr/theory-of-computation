import * as React from "react";
import {Create, Edit} from 'react-admin';
import {GrammarForm} from "./grammarForm";
import {Grammar} from "./grammar";

export function transformGrammarUpsert(record: {id: string, grammar: string}):  Grammar {
    const nameMatcher = record.grammar.match(/(?<name>[\w\d,\\_-]+)=(.*)/i);
    const terminalSymbolMatcher = record.grammar.match(/terminal:\\left\\lbrace(?<terminal_symbols>[\w \d,\\_-]+)\\right\\rbrace/i);
    const nonterminalSymbolMatcher = record.grammar.match(/nonterminal:\\left\\lbrace(?<nonterminal_symbols>[\w \d,\\_-]+)\\right\\rbrace/i);
    const productionRuleMatcher = record.grammar.match(/production\\_rules:\\left\\lbrace(?<production_rules>[\w \d,\\_-]+)((\\rbrace\\right)|(\\right\\rbrace)){2,}/);
    const startSymbolMatcher = record.grammar.match(/start\\_symbol:(?<start_symbol>[\w\d\\_-]+)/);
    return {
        name: nameMatcher?.groups?.name ?? "",
        terminal_symbols: terminalSymbolMatcher?.groups?.terminal_symbols.trim() ?? "",
        nonterminal_symbols: nonterminalSymbolMatcher?.groups?.nonterminal_symbols.trim() ?? "",
        production_rules: productionRuleMatcher?.groups?.production_rules.trim() ?? "",
        start_symbol: startSymbolMatcher?.groups?.start_symbol.trim() ?? "",
        ...record
    };
}

export const GrammarCreate = (props: any) => (
    <Create transform={transformGrammarUpsert} {...props}>
        <GrammarForm redirect="edit" />
    </Create>
);

export const GrammarEdit = (props: any) => (
    <Edit transform={transformGrammarUpsert} {...props}>
        <GrammarForm  redirect={false} />
    </Edit>
);