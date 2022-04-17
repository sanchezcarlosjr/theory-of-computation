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
                    "0": "B",
                    "1": "A",
                    "accept": true
                },
                "B": {
                    "0": "B",
                    "1": "B",
                    "accept": true
                },
                "C": {
                    "0": "A",
                    "1": "C",
                    "accept": true
                }
            }, "A");
            const dfa = deterministicFiniteAutomaton.removeUnreachableStates();
            expect(dfa).toEqual(new DeterministicFiniteAutomaton({
                "A": {
                    "0": "B",
                    "1": "A",
                    "accept": true
                },
                "B": {
                    "0": "B",
                    "1": "B",
                    "accept": true
                },
            }, "A"));
        });
    });
    describe('NondeterministicFiniteAutomaton', () => {
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
                },
                "q": {
                    "0": new Set<string>(["r"]), "1": new Set<string>(["q", "r"])
                },
                "r": {
                    "0": new Set<string>(["s"]), "1": new Set<string>(["p"])
                },
                "s": {
                    "0": new Set<string>([]), "1": new Set<string>(["p"])
                }
            }, "p");
            const expectedDeterministicFiniteAutomaton = new DeterministicFiniteAutomaton({
                "p": {
                    "0": "qs", "1": "q"
                },
                "qs": {
                    "0": "r", "1": "pqr"
                },
                "q": {
                    "0": "r", "1": "qr"
                },
                "qr": {
                    "0": "rs", "1": "pqr"
                },
                "r": {
                    "0": "s", "1": "p"
                },
                "qrp": {
                    "0": "qrs", "1": "pqr"
                },
                "s": {
                    "0": "", "1": "p"
                },
                "rsq": {
                    "0": "rs", "1": "pqr"
                },
                "": {
                    "0": "", "1": ""
                },
                "rs": {
                    "0": "s", "1": "p"
                }
            }, "p");
            expect(deterministicFiniteAutomaton).toEqual(expectedDeterministicFiniteAutomaton);
        });
    });
});