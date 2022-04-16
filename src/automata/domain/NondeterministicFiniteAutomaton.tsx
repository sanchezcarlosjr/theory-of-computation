import {FiniteAutomaton} from "./FiniteAutomaton";
import {DeterministicFiniteAutomaton} from "./DeterministicFiniteAutomaton";
import {Queue} from "../../@shared/Queue";
import {Delta} from "./Delta";
import {intersection, union} from "../../@shared/SetOperations";


export class NondeterministicFiniteAutomaton extends FiniteAutomaton {
    constructor(delta: Delta, startState: string = "") {
        super(delta, startState);
        this.ensureAlphabetIsInDelta();
    }

    iterate(f: (state: string, symbol: string, rState: string) => void): void {
        this.states.forEach((state) =>
            Object.keys(this.delta[state])
                .forEach((symbol) =>
                (this.delta[state][symbol] as Set<string>)
                    .forEach((rState) => f(state, symbol, rState))
            )
        );
    }

    accepts(symbol: string): boolean {
        return false;
    }

    transit(symbol: string): void {
    }

    toDeterministicFiniteAutomaton(): DeterministicFiniteAutomaton {
        const delta: Delta = {};
        const visitedStates = new Set<string>();
        const queue = new Queue<Set<string>>(new Set<string>([this.startState]));
        const startState = this.startState;
        while (!queue.isEmpty()) {
            const states = queue.dequeue();
            const key = [...states].join("");
            delta[key] = {};
            if (intersection(this.accepting_states, states).size > 0) {
                delta[key]["accept"] = true;
            }
            this.alphabet.forEach((symbol) => {
                const rStates = this.deltaTransition(states, symbol) as Set<string>;
                const newKey = [...rStates].sort().join("");
                delta[key][symbol] = newKey;
                if (!visitedStates.has(newKey)) {
                    visitedStates.add(newKey);
                    queue.enqueue(rStates as Set<string>);
                }
            });
        }
        return new DeterministicFiniteAutomaton(delta, startState);
    }

    // δn(S,a)=∪δm(p,a), p in S
    deltaTransition(state: string | Set<string | number> | number, symbol: string) {
        if (typeof state == "number" || typeof state == "string") {
            state = new Set<string | number>([state]);
        }
        let temp = new Set<string>();
        state.forEach((rState) => {
            temp = union(temp, this.delta[rState][symbol] as Set<string>);
        });
        return temp;
    }

    private ensureAlphabetIsInDelta() {
        this.alphabet.forEach((symbol) =>
            this.states.forEach((state) => this.delta[state][symbol] = this.buildSetFrom(state, symbol))
        );
    }

    private buildSetFrom(state: string, symbol: string): Set<string> {
        if (!this.delta[state].hasOwnProperty(symbol)) {
            return new Set<string>();
        }
        if (typeof this.delta[state][symbol] === "string" || typeof this.delta[state][symbol] === "number") {
            return new Set<string>([this.delta[state][symbol] as string]);
        }
        if (Array.isArray(this.delta[state][symbol])) {
            return new Set<string>(this.delta[state][symbol] as unknown as string[]);
        }
        return this.delta[state][symbol] as Set<string>;
    }
}