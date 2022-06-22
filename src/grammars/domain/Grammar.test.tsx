import {Grammar} from "./Grammar";
import {ProductionRule} from "./ProductionRule";
import {GrammarRecord} from "../grammarRecord";
import {breakTokens} from "./BreakTokens";
import {NonTerminalSymbols} from "./NonTerminalSymbols";
import {TerminalSymbol} from "./TerminalSymbol";
import {NonTerminalSymbol} from "./NonTerminalSymbol";

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


test("Grammar should build GrammarRecordMock1", () => {
    const rules = [
        new ProductionRule({from: "\\Sigma", to: "S"}),
        new ProductionRule({from: "\\Sigma", to: "B"}),
        new ProductionRule({from: "S", to: "\\lambda"}),
        new ProductionRule({from: "B", to: "a+-."})
    ];
    rules.forEach((rule) => rule.setSymbols(grammar.terminal_symbols, grammar.nonterminal_symbols));
    const grammar = new Grammar(
        "Compilers book",
        new Set<string>(["a", "+", "-", "."]),
        new NonTerminalSymbols("\\Sigma", "S", "B"),
        rules,
        "\\Sigma"
    );
    expect(grammar.name).toBe("Compiler book");
    // eslint-disable-next-line eqeqeq
    expect(grammar.start_symbol == "\\Sigma").toBeTruthy();
    expect(grammar.nonterminal_symbols.has("\\Sigma")).toBeTruthy();
    expect(grammar.nonterminal_symbols.has("S")).toBeTruthy();
    expect(grammar.nonterminal_symbols.has("B")).toBeTruthy();
    expect(grammar.terminal_symbols.has("a")).toBeTruthy();
    expect(grammar.terminal_symbols.has("+")).toBeTruthy();
    expect(grammar.terminal_symbols.has("-")).toBeTruthy();
    expect(grammar.terminal_symbols.has(".")).toBeTruthy();
    expect(grammar.production_rules[0]).toEqual(rules[0]);
    expect(grammar.production_rules[1]).toEqual(rules[1]);
    expect(grammar.production_rules[2]).toEqual(rules[2]);
    expect(grammar.production_rules[3]).toEqual(rules[3]);
});

test("Grammar should execute steps from parser", () => {
    const grammar = new Grammar(
        "Compilers book",
        new Set<string>(["a", "+", "-", "."]),
        new NonTerminalSymbols("\\Sigma", "S", "B"),
        [
            new ProductionRule({from: "\\Sigma", to: "S"}),
            new ProductionRule({from: "\\Sigma", to: "B"}),
            new ProductionRule({from: "S", to: "\\lambda"}),
            new ProductionRule({from: "B", to: "a+-."})
        ],
        "\\Sigma"
    );
    const automaton = grammar.buildTransducerAutomaton();
    expect(automaton.deriveString()).toBe("\\Sigma");
    automaton.applyRule(0);
    expect(automaton.deriveString()).toBe("S");
    automaton.applyRule(2);
    expect(automaton.deriveString()).toBe("");
    automaton.reset();
    automaton.applyRule(1);
    automaton.applyRule(3);
    expect(automaton.deriveString()).toBe("a+-.");
});

test.skip("Grammar should execute steps from GrammarMock2 parser", () => {
    const grammar = new Grammar(
        "Compilers book",
        new Set<string>(["a", "+", "-", "."]),
        new NonTerminalSymbols("\\Sigma", "S", "B"),
        [
            new ProductionRule({from: "\\Sigma", to: "S"}),
            new ProductionRule({from: "\\Sigma", to: "B"}),
            new ProductionRule({from: "S", to: "\\lambda"}),
            new ProductionRule({from: "B", to: "a+-."})
        ],
        "\\Sigma"
    );
    const automaton = grammar.buildTransducerAutomaton();
    expect(automaton.deriveString()).toBe("\\Sigma");
    automaton.applyRule(0);
    expect(automaton.deriveString()).toBe("S");
    automaton.applyRule(1);
    expect(automaton.deriveString()).toBe("");
    automaton.reset();
    automaton.applyRule(0);
    automaton.applyRule(1);
    expect(automaton.deriveString()).toBe("");
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

test.skip("Production rule make accepted set", () => {
    const grammar = new Grammar(
        "Compilers book",
        new Set<string>(["a", "+", "-", "."]),
        new NonTerminalSymbols("\\Sigma", "S", "B"),
        [
            new ProductionRule({from: "\\Sigma", to: "S"}),
            new ProductionRule({from: "\\Sigma", to: "B"}),
            new ProductionRule({from: "S", to: "\\lambda"}),
            new ProductionRule({from: "B", to: "a+-."})
        ],
        "\\Sigma"
    );
    const automaton = grammar.buildTransducerAutomaton();
    expect(automaton.actual_state().acceptable_next_rule(0)).toBeTruthy();
    automaton.applyRule(0);
    expect(automaton.actual_state().acceptable_next_rule(1)).toBeTruthy();
    expect(automaton.actual_state().acceptable_next_rule(2)).toBeFalsy();
});

test("Production rule know what is its type", () => {
    const terminals = new Set<TerminalSymbol>(["a","b", "c", "d", "e"]);
    const nonterminals = new NonTerminalSymbols("\\Sigma", "S", "A");
    const rules = [
        new ProductionRule({from: "\\Sigma", to: "S"}),
        new ProductionRule({from: "\\Sigma", to: "Sa"}),
        new ProductionRule({from: "\\Sigma", to: "aS"}),
        new ProductionRule({from: "\\Sigma", to: "SaS"}),
        new ProductionRule({from: "\\Sigma", to: "\\lambda"}),
        new ProductionRule({from: "S", to: "A"}),
        new ProductionRule({from: "S", to: "\\lambda"}),
        new ProductionRule({from: "SA", to: "ab"}),
        new ProductionRule({from: "SA", to: "a"}),
        new ProductionRule({from: "\\Sigma", to: "a"}),
    ];
    rules.forEach((rule) => rule.setSymbols(terminals, nonterminals));
    expect(rules[0].type).toBe(3);
    expect(rules[1].type).toBe(3.1);
    expect(rules[2].type).toBe(3.2);
    expect(rules[3].type).toBe(2);
    expect(rules[4].type).toBe(3);
    expect(rules[5].type).toBe(3);
    expect(rules[6].type).toBe(3);
    expect(rules[7].type).toBe(1);
    expect(rules[8].type).toBe(0);
    expect(rules[9].type).toBe(3);
});

test('breakTokens should find all strings', () => {
    let array = breakTokens("Sa\\Sigmaa\\Sigma", new Set(["S", "a", "\\Sigma"]));
    expect(array).toEqual(["S", "a", "\\Sigma", "a", "\\Sigma" ]);
    array = breakTokens("SX\\SigmaX\\lambda\\Sigma", new Set(["S", "X", "\\Sigma", "\\lambda", "a"]));
    expect(array).toEqual(["S", "X", "\\Sigma", "X", "\\lambda", "\\Sigma" ]);
});

test("it should parse", () => {
    const grammar = new Grammar(
        "Compilers book",
        new Set<string>(["x", "(", ")", "+"]),
        new NonTerminalSymbols("E", "T", "A"),
        [
            new ProductionRule({from: "E", to: "A"}),
            new ProductionRule({from: "A", to: "T"}),
            new ProductionRule({from: "A", to: "A+T"}),
            new ProductionRule({from: "T", to: "x"}),
            new ProductionRule({from: "T", to: "(A)"}),
        ],
        "E"
    );
    const result = grammar.parse("(x+x)");
    expect(result.accepts).toEqual(true);
});

test.only('it should build parse tree', () => {
    const grammar = new Grammar(
        "Compilers book",
        new Set<string>(["id", "*"]),
        new NonTerminalSymbols("E", "T", "F"),
        [
            new ProductionRule({from: "E", to: "T"}),
            new ProductionRule({from: "T", to: "T*F"}),
            new ProductionRule({from: "F", to: "id"}),
            new ProductionRule({from: "T", to: "F"})
        ],
        "E"
    );
    const parseTree = grammar.parse("id*id");
    expect(parseTree.accepts).toBeTruthy();
    const tree = parseTree.buildParseTree();
    expect(tree).toEqual([
        {
            id: 0,
            label: "<E>",
            children: [1]
        },
        {
            id: 1,
            label: "<T>",
            children: [2, 3, 4]
        },
        {
            id: 2,
            label: "<T>",
            children: [5]
        },
        {
            id: 3,
            label: "*"
        },
        {
            id: 4,
            label: "<F>",
            children: [6]
        },
        {
            id: 5,
            label: "<F>",
            children: [7]
        },
        {
            id: 6,
            label: "id"
        },
        {
            id: 7,
            label: "id"
        }
    ]);
});