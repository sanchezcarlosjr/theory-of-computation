import {Grammar, NonTerminalSymbol, NonTerminalSymbols, TerminalSymbol} from "./Grammar";
import {ProductionRule} from "./ProductionRule";
import {GrammarRecord} from "../grammarRecord";
import {transformGrammarUpsert} from "../grammarUpsert";
import {grammarRecordMock1} from "../grammarForm.test";

test('Grammar should ensure nonterminal symbol is not in nonsymbol set.', () => {
    const terminals = [new TerminalSymbol("a")];
    const start_symbol = new NonTerminalSymbol("S");
    const s = new NonTerminalSymbol("X");
    const nonterminals = new NonTerminalSymbols(s);
    const production_rules = [new ProductionRule({from: "A", to: "B"})];
    expect(() => new Grammar("G", new Set(terminals), nonterminals, production_rules, start_symbol)).toThrow("Start symbol is not a non terminal symbol.");
});

test('Grammar should ensure nonterminal symbol is in nonsymbol set.', () => {
    const terminals = [new TerminalSymbol("a")];
    const start_symbol = new NonTerminalSymbol("S");
    const nonterminals = new NonTerminalSymbols(start_symbol);
    const production_rules = [new ProductionRule({from: "A", to: "B"})];
    expect(() => new Grammar("G", new Set(terminals), nonterminals, production_rules, start_symbol)).not.toThrow("Start symbol is not a non terminal symbol.");
});

test('Grammar should derive a simply string', () => {
    const terminals = [new TerminalSymbol("a"), new TerminalSymbol("b")];
    const start_symbol = new NonTerminalSymbol("S");
    const nonterminals = new NonTerminalSymbols(start_symbol);
    const production_rules = [new ProductionRule({from: "S", to: "a"}), new ProductionRule({from: "S", to: "b"})];
    const grammar = new Grammar("G", new Set(terminals), nonterminals, production_rules, start_symbol);
    const automaton = grammar.buildTransducerAutomaton();
    automaton.applyRule(0);
    expect(automaton.deriveString()).toBe("a");
    automaton.reset();
    automaton.applyRule(1);
    expect(automaton.deriveString()).toBe("b");
});

test('Grammar should derive a string with recursive rules from StartSymbol (Regular)', () => {
    const terminals = [new TerminalSymbol("a"), new TerminalSymbol("b")];
    const start_symbol = new NonTerminalSymbol("S");
    const nonterminals = new NonTerminalSymbols(start_symbol);
    const production_rules = [
        new ProductionRule({from: "S", to: "Sa"}),
        new ProductionRule({from: "S", to: "b"})
    ];
    const grammar = new Grammar("G", new Set(terminals), nonterminals, production_rules, start_symbol);
    const automaton = grammar.buildTransducerAutomaton();
    automaton.applyRule(0);
    automaton.applyRule(1);
    expect(automaton.deriveString()).toBe("ba");
    automaton.reset();
    automaton.applyRule(0);
    automaton.applyRule(0);
    automaton.applyRule(1);
    expect(automaton.deriveString()).toBe("baa");
    automaton.reset();
    automaton.applyRule(0);
    automaton.applyRule(0);
    automaton.applyRule(0);
    automaton.applyRule(1);
    expect(automaton.deriveString()).toBe("baaa");
});

test('Grammar should derive a string with recursive rules from StartSymbol (Free Grammar)', () => {
    const terminals = [new TerminalSymbol("a"), new TerminalSymbol("b")];
    const start_symbol = new NonTerminalSymbol("S");
    const nonterminals = new NonTerminalSymbols(start_symbol);
    const production_rules = [
        new ProductionRule({from: "S", to: "Sa"}),
        new ProductionRule({from: "S", to: "bS"}),
        new ProductionRule({from: "S", to: ""})
    ];
    const grammar = new Grammar("G", new Set(terminals), nonterminals, production_rules, start_symbol);
    const automaton = grammar.buildTransducerAutomaton();
    automaton.applyRule(2);
    expect(automaton.deriveString()).toBe("");
    automaton.reset();
    automaton.applyRule(0);
    automaton.applyRule(2);
    expect(automaton.deriveString()).toBe("a");
    automaton.reset();
    automaton.applyRule(0);
    automaton.applyRule(1);
    automaton.applyRule(2);
    expect(automaton.deriveString()).toBe("ba");
});


test("Grammar should parse GrammarRecordMock1", () => {
    const record: GrammarRecord = transformGrammarUpsert(grammarRecordMock1);
    const grammar = Grammar.parse(record);
    expect(grammar.name).toBe(record.name);
    // eslint-disable-next-line eqeqeq
    expect(grammar.start_symbol == record.start_symbol).toBeTruthy();
    expect(grammar.nonterminal_symbols.has("\\Sigma")).toBeTruthy();
    expect(grammar.nonterminal_symbols.has("S")).toBeTruthy();
    expect(grammar.nonterminal_symbols.has("B")).toBeTruthy();
    expect(grammar.terminal_symbols.has("a")).toBeTruthy();
    expect(grammar.terminal_symbols.has("+")).toBeTruthy();
    expect(grammar.terminal_symbols.has("-")).toBeTruthy();
    expect(grammar.terminal_symbols.has(".")).toBeTruthy();
});

test('Production rule ensure its symbols are either nonterminal symbols or terminal symbols', () => {
    const terminals = new Set<TerminalSymbol>([new TerminalSymbol("a"), new TerminalSymbol("b")]);
    const start_symbol = new NonTerminalSymbol("S");
    const nonterminals = new NonTerminalSymbols(start_symbol);
    const rule = new ProductionRule({from: "S", to: "Sa"});
    expect(() => rule.setSymbols(terminals, nonterminals)).not.toThrow("Production rule's symbols must be either nonterminals or terminals.");
});