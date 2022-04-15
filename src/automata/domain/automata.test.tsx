import {NondeterministicFiniteAutomaton} from "./NondeterministicFiniteAutomaton";
import {DeterministicFiniteAutomaton} from "./DeterministicFiniteAutomaton";
import {Delta} from "./Delta";

function convertNFAToDFABy(delta: Delta, startState: string) {
    const nondeterministicFiniteAutomaton = new NondeterministicFiniteAutomaton(delta, startState);
    return nondeterministicFiniteAutomaton.toDeterministicFiniteAutomaton();
}

// John E. Hopcroft, Rajeev Motwani, Jeffrey D. Ullman-Introduction to Automata Theory, Languages, and Computations-Prentice Hall (2006) Exercises
describe('Automata domain', () => {
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
                "{p}": {
                    "0": "{p,q}", "1": "{p}"
                }, "{p,q}": {
                    "0": "{p,q,r}", "1": "{p,r}"
                }, "{p,q,r}": {
                    "0": "{p,q,r,s}", "1": "{p,r}"
                }, "{p,r}": {
                    "0": "{p,q,s}", "1": "{p}"
                }, "{p,q,r,s}": {
                    "0": "{p,q,r,s}", "1": "{p,r,s}"
                }, "{p,q,s}": {
                    "0": "{p,q,r,s}", "1": "{p,r,s}"
                }, "{p,r,s}": {
                    "0": "{p,q,s}", "1": "{p,s}"
                }, "{p,s}": {
                    "0": "{p,q,s}", "1": "{p,s}"
                }
            }, "{p}");
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
                "{q0}": {
                    "1": "{q0}", "0": "{q0,q1}"
                }, "{q0,q1}": {
                    "0": "{q0,q1}", "1": "{q0,q2}"
                }, "{q0,q2}": {
                    "0": "{q0,q1}", "1": "{q0}"
                }
            }, "{q0}");
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
                "{p}": {
                    "0": "{q,s}", "1": "{q}"
                },
                "{q,s}": {
                    "0": "{r}", "1": "{p,q,r}"
                },
                "{q}": {
                    "0": "{r}", "1": "{q,r}"
                },
                "{q,r}": {
                    "0": "{r,s}", "1": "{p,q,r}"
                },
                "{r}": {
                    "0": "{s}", "1": "{p}"
                },
                "{q,r,p}": {
                    "0": "{q,r,s}", "1": "{p,q,r}"
                },
                "{s}": {
                    "0": "{}", "1": "{p}"
                },
                "{r,s,q}": {
                    "0": "{r,s}", "1": "{p,q,r}"
                },
                "{}": {
                    "0": "{}", "1": "{}"
                },
                "{r,s}": {
                    "0": "{s}", "1": "{p}"
                }
            }, "{p}");
            expect(deterministicFiniteAutomaton).toEqual(expectedDeterministicFiniteAutomaton);
        });
    });
});