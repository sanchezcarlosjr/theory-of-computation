import {Grammar, NonTerminalSymbol, NonTerminalSymbols, TerminalSymbol} from "./Grammar";
import {ProductionRule} from "./ProductionRule";
import {GrammarRecord} from "../grammarRecord";
import {transformGrammarUpsert} from "../grammarUpsert";
import {grammarRecordMock1, grammarRecordMock2} from "../grammarForm.test";

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
    const rule0 = new ProductionRule({from: "\\Sigma", to: "S"});
    rule0.setSymbols(grammar.terminal_symbols, grammar.nonterminal_symbols);
    expect(grammar.production_rules[0]).toEqual(rule0);
    const rule1 = new ProductionRule({from: "\\Sigma", to: "B"});
    rule1.setSymbols(grammar.terminal_symbols, grammar.nonterminal_symbols);
    expect(grammar.production_rules[1]).toEqual(rule1);
    expect(grammar.production_rules[2]).toEqual(new ProductionRule({from: "S", to: "\\lambda"}));
    expect(grammar.production_rules[3]).toEqual(new ProductionRule({from: "B", to: "a+-."}));
});

test("Grammar should execute steps from parser", () => {
    const record: GrammarRecord = transformGrammarUpsert(grammarRecordMock1);
    const grammar = Grammar.parse(record);
    const automaton = grammar.buildTransducerAutomaton();
    expect(automaton.deriveString()).toBe("\\Sigma");
    automaton.applyRule(0);
    expect(automaton.deriveString()).toBe("S");
    automaton.applyRule(2);
    expect(automaton.deriveString()).toBe("\\lambda");
    automaton.reset();
    automaton.applyRule(1);
    automaton.applyRule(3);
    expect(automaton.deriveString()).toBe("a+-.");
});

test("Grammar should execute steps from GrammarMock2 parser", () => {
    const record: GrammarRecord = transformGrammarUpsert(grammarRecordMock2);
    const grammar = Grammar.parse(record);
    const automaton = grammar.buildTransducerAutomaton();
    expect(automaton.deriveString()).toBe("\\Sigma");
    automaton.applyRule(0);
    expect(automaton.deriveString()).toBe("S");
    automaton.applyRule(1);
    expect(automaton.deriveString()).toBe("\\lambda");
    automaton.reset();
    automaton.applyRule(0);
    automaton.applyRule(1);
    expect(automaton.deriveString()).toBe("\\lambda");
    automaton.reset();
    automaton.applyRule(0);
    automaton.applyRule(2);
    expect(automaton.deriveString()).toBe("a");
    automaton.reset();
    automaton.applyRule(1);
    expect(automaton.deriveString()).toBe("\\Sigma");
});

test('Production rule ensure its symbols are either nonterminal symbols or terminal symbols', () => {
    const terminals = new Set<TerminalSymbol>([new TerminalSymbol("a"), new TerminalSymbol("b")]);
    const start_symbol = new NonTerminalSymbol("S");
    const nonterminals = new NonTerminalSymbols(start_symbol);
    const rule = new ProductionRule({from: "S", to: "Sa"});
    const rule2 = new ProductionRule({from: "A", to: "Sa"});
    rule.setSymbols(terminals, nonterminals);
    expect(rule.is_start_rule).toBe(true);
    expect(rule2.is_start_rule).toBe(false);
    expect(() => rule.setSymbols(terminals, nonterminals)).not.toThrow("Production rule's symbols must be either nonterminals or terminals.");
});

test("Production rule make accepted set", () => {
    const record: GrammarRecord = transformGrammarUpsert(grammarRecordMock2);
    const grammar = Grammar.parse(record);
    const automaton = grammar.buildTransducerAutomaton();
    expect(automaton.actual_state().acceptable_next_rule(0)).toBeTruthy();
    automaton.applyRule(0);
    expect(automaton.actual_state().acceptable_next_rule(1)).toBeTruthy();
    expect(automaton.actual_state().acceptable_next_rule(2)).toBeFalsy();
});