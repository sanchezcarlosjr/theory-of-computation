import {NondeterministicFiniteAutomaton} from "./NondeterministicFiniteAutomaton";
import {DeterministicFiniteAutomaton} from "./DeterministicFiniteAutomaton";
import {Delta} from "./Delta";

function convertNFAToDFABy(delta: Delta, startState: string) {
    const nondeterministicFiniteAutomaton = new NondeterministicFiniteAutomaton(delta, startState);
    return nondeterministicFiniteAutomaton.toDeterministicFiniteAutomaton();
}

// John E. Hopcroft, Rajeev Motwani, Jeffrey D. Ullman-Introduction to Automata Theory, Languages, and Computations-Prentice Hall (2006) Exercises
describe('Automata domain', () => {
    describe('Automata Minimization', () => {
        test('minimize moore machine', () => {
            const deterministicFiniteAutomaton = new DeterministicFiniteAutomaton({
                "A": {
                    "0": "B", "1": "A", "accept": true
                }, "B": {
                    "0": "B", "1": "B", "accept": true
                }, "C": {
                    "0": "A", "1": "C", "accept": true
                }
            }, "A");
            const dfa = deterministicFiniteAutomaton.removeUnreachableStates();
            expect(dfa).toEqual(new DeterministicFiniteAutomaton({
                "A": {
                    "0": "B", "1": "A", "accept": true
                }, "B": {
                    "0": "B", "1": "B", "accept": true
                },
            }, "A"));
        });
        test('determine initial partition', () => {
            const deterministicFiniteAutomaton = new DeterministicFiniteAutomaton({
                "A": {
                    "0": "B", "1": "A", "accept": true
                }, "B": {
                    "0": "B", "1": "B"
                }, "C": {
                    "0": "A", "1": "C"
                }
            }, "A");
            const history = deterministicFiniteAutomaton.findEquivalentStates();
            expect(history).toEqual([[['A'], ['B', 'C']], [['A'], ['B'], ['C']]]);
        });
        test('remove equivalent states', () => {
            const deterministicFiniteAutomaton = new DeterministicFiniteAutomaton({
                "A": {
                    "0": "B", "1": "A", "accept": true
                }, "B": {
                    "0": "B", "1": "B", "accept": true
                }, "C": {
                    "0": "A", "1": "C"
                }
            }, "A");
            const automaton = deterministicFiniteAutomaton.removeEquivalentStates();
            expect(automaton).toEqual(new DeterministicFiniteAutomaton({
                "A": {
                    "0": "A", "1": "A", "accept": true
                }, "B": {
                    "0": "A", "1": "A", "accept": true
                }, "C": {
                    "0": "A", "1": "C"
                }
            }, "A"));
        });
    });
    describe('NondeterministicFiniteAutomaton', () => {
        test.only('it should convert example UABC 2022', () => {
            const dfa = convertNFAToDFABy({
                "A": {
                    "0": ["A", "B"],
                    "start": true
                },
                "B": {
                    "0": ["A"],
                    "1": ["C"]
                },
                "C": {
                    "0": ["C"],
                    "accept": true
                },
                "D": {
                    "0": "D",
                    "1": "E",
                    "accept": true
                },
                "E": {
                    "0": "D",
                    "1": "C",
                    "start": true
                }
            }, "");
            console.log(dfa);
        });
        test("it should build start states (>=2) to epsilon states", () => {
            const nfa = new NondeterministicFiniteAutomaton({
                "1": {
                    "": "3", "b": "2", "start": true
                }, "2": {
                    "a": new Set<string>(["2", "3"]), "b": "3", "start": true
                }, "3": {
                    "a": "1"
                }
            }, "1");
            expect(nfa).toEqual(new NondeterministicFiniteAutomaton({
                "START_STATE": {
                    "": new Set<string>(["1", "2"])
                },
                "1": {
                    "": "3", "b": "2"
                }, "2": {
                    "a": new Set<string>(["2", "3"]), "b": "3"
                }, "3": {
                    "a": "1"
                }
            }, "START_STATE"));
        });
        test("it should convert nfa to dfa with epsilon states", () => {
            const dfa = convertNFAToDFABy({
                "1": {
                    "": "3", "b": "2", "accept": true
                }, "2": {
                    "a": new Set<string>(["2", "3"]), "b": "3"
                }, "3": {
                    "a": "1"
                }
            }, "1");
            expect(dfa).toEqual(new DeterministicFiniteAutomaton({
                "13": {
                    "a": "13", "b": "2", "accept": true
                }, "2": {
                    "a": "23", "b": "3"
                }, "3": {
                    "a": "13", "b": "NULL"
                }, "23": {
                    "a": "123", "b": "3"
                }, "123": {
                    "a": "123", "b": "23", "accept": true
                }, "NULL": {
                    "a": "NULL", "b": "NULL"
                }
            }, "13"));
        });
        test('it should reaches epsilon-closure states', () => {
            const delta = {
                "1": {
                    "": new Set<string>(["2", "4"]),
                }, "2": {
                    "": new Set<string>(["3"])
                }, "3": {
                    "": new Set<string>(["6"])
                }, "4": {
                    "a": new Set<string>(["5"])
                }, "5": {
                    "b": new Set<string>(["6"]), "": new Set<string>(["7"])
                }, "6": {}, "7": {}, "8": {"a": "6", "b": "7"}
            };
            const nfa = new NondeterministicFiniteAutomaton(delta);
            expect(nfa.reachesEpsilonClosureStates("8")).toEqual(new Set<string>(["8"]));
            expect(nfa.reachesEpsilonClosureStates(new Set<string>(["6", "7"]))).toEqual(new Set<string>(["6", "7"]));
            expect(nfa.reachesEpsilonClosureStates(new Set<string>(["5", "6", "7"]))).toEqual(new Set<string>(["5", "6", "7"]));
            expect(nfa.reachesEpsilonClosureStates(new Set<string>(["3"]))).toEqual(new Set<string>(["3", "6"]));
            expect(nfa.reachesEpsilonClosureStates(new Set<string>(["1"]))).toEqual(new Set<string>(["1", "2", "3", "4", "6"]));
            expect(nfa.reachesEpsilonClosureStates(new Set<string>(["1", "3"]))).toEqual(new Set<string>(["1", "2", "3", "4", "6"]));
            expect(nfa.reachesEpsilonClosureStates(new Set<string>(["3", "4"]))).toEqual(new Set<string>(["3", "6", "4"]));
            expect(nfa.reachesEpsilonClosureStates(new Set<string>(["2", "5"]))).toEqual(new Set<string>(["2", "3", "6", "5", "7"]));
        });
        test('ensure delta has all alphabet', () => {
            const delta = {
                "q0": {
                    "0": new Set<string>(["q0", "q1"]), "1": new Set<string>(["q0"])
                }, "q1": {
                    "1": new Set<string>(["q2"])
                }, "q2": {
                    "1": new Set<string>([])
                }
            };
            new NondeterministicFiniteAutomaton(delta, "q0");
            // @ts-ignore
            expect(delta["q2"]["0"]).toEqual(new Set<string>([]));
            // @ts-ignore
            expect(delta["q1"]["0"]).toEqual(new Set<string>([]));
        });
        test('delta transition', () => {
            const delta = {
                "q0": {
                    "0": new Set<string>(["q0", "q1"]), "1": new Set<string>(["q0"])
                }, "q1": {
                    "0": new Set<string>(["q2"]), "1": new Set<string>(["q2"])
                }, "q2": {
                    "0": new Set<string>(["q3"]), "1": new Set<string>()
                }, "q3": {
                    "0": new Set<string>(["q3"]), "1": new Set<string>()
                }
            };
            const nfa = new NondeterministicFiniteAutomaton(delta, "q0");
            expect(nfa.deltaTransition("q0", "0")).toEqual(new Set<string>(["q0", "q1"]));
            expect(nfa.deltaTransition(new Set(["q0"]), "0")).toEqual(new Set<string>(["q0", "q1"]));
            expect(nfa.deltaTransition(new Set(["q0"]), "1")).toEqual(new Set<string>(["q0"]));
            expect(nfa.deltaTransition(new Set(["q0", "q2"]), "0")).toEqual(new Set<string>(["q0", "q1", "q3"]));
            expect(nfa.deltaTransition(new Set(["q3"]), "1")).toEqual(new Set<string>([]));
        });
        test('convert nondeterministic finite automaton to deterministic finite automaton - Exercise 2.3.1', () => {
            const deterministicFiniteAutomaton: DeterministicFiniteAutomaton = convertNFAToDFABy({
                "p": {
                    "0": new Set<string>(["p", "q"]), "1": new Set<string>(["p"])
                }, "q": {
                    "0": new Set<string>(["r"]), "1": new Set<string>(["r"])
                }, "r": {
                    "0": new Set<string>(["s"]), "1": new Set<string>()
                }, "s": {
                    "0": new Set<string>(["s"]), "1": new Set<string>(["s"])
                }
            }, "p");
            const expectedDeterministicFiniteAutomaton = new DeterministicFiniteAutomaton({
                "p": {
                    "0": "pq", "1": "p"
                }, "pq": {
                    "0": "pqr", "1": "pr"
                }, "pqr": {
                    "0": "pqrs", "1": "pr"
                }, "pr": {
                    "0": "pqs", "1": "p"
                }, "pqrs": {
                    "0": "pqrs", "1": "prs"
                }, "pqs": {
                    "0": "pqrs", "1": "prs"
                }, "prs": {
                    "0": "pqs", "1": "ps"
                }, "ps": {
                    "0": "pqs", "1": "ps"
                }
            }, "p");
            expect(deterministicFiniteAutomaton).toEqual(expectedDeterministicFiniteAutomaton);
        });
        test('convert nondeterministic finite automaton to deterministic finite automaton - Fig 2.9', () => {
            const deterministicFiniteAutomaton: DeterministicFiniteAutomaton = convertNFAToDFABy({
                "q0": {
                    "0": new Set<string>(["q0", "q1"]), "1": new Set<string>(["q0"])
                }, "q1": {
                    "0": new Set<string>(), "1": new Set<string>(["q2"])
                }, "q2": {
                    "0": new Set<string>(), "1": new Set<string>()
                }
            }, "q0");
            const expectedDeterministicFiniteAutomaton = new DeterministicFiniteAutomaton({
                "q0": {
                    "1": "q0", "0": "q0q1"
                }, "q0q1": {
                    "0": "q0q1", "1": "q0q2"
                }, "q0q2": {
                    "0": "q0q1", "1": "q0"
                }
            }, "q0");
            expect(deterministicFiniteAutomaton).toEqual(expectedDeterministicFiniteAutomaton);
        });
        test('convert nondeterministic finite automaton to deterministic finite automaton - Exercise 2.3.2', () => {
            const deterministicFiniteAutomaton: DeterministicFiniteAutomaton = convertNFAToDFABy({
                "p": {
                    "0": new Set<string>(["q", "s"]), "1": new Set<string>(["q"])
                }, "q": {
                    "0": new Set<string>(["r"]), "1": new Set<string>(["q", "r"])
                }, "r": {
                    "0": new Set<string>(["s"]), "1": new Set<string>(["p"])
                }, "s": {
                    "0": new Set<string>([]), "1": new Set<string>(["p"])
                }
            }, "p");
            const expectedDeterministicFiniteAutomaton = new DeterministicFiniteAutomaton({
                "p": {
                    "0": "qs", "1": "q"
                }, "qs": {
                    "0": "r", "1": "pqr"
                }, "q": {
                    "0": "r", "1": "qr"
                }, "qr": {
                    "0": "rs", "1": "pqr"
                }, "r": {
                    "0": "s", "1": "p"
                }, "pqr": {
                    "0": "qrs", "1": "pqr"
                }, "s": {
                    "0": "NULL", "1": "p"
                }, "NULL": {
                    "0": "NULL", "1": "NULL"
                }, "rs": {
                    "0": "s", "1": "p"
                }, "qrs": {
                    "0": "rs", "1": "pqr"
                }
            }, "p");
            expect(deterministicFiniteAutomaton).toEqual(expectedDeterministicFiniteAutomaton);
        });
    });
});