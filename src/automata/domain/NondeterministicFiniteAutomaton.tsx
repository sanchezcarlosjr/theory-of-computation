import {FiniteAutomaton} from "./FiniteAutomaton";
import {DeterministicFiniteAutomaton} from "./DeterministicFiniteAutomaton";
import {Delta} from "./Delta";
import {union} from "../../@shared/SetOperations";
import {NondeterministicFiniteAutomatonTransformer} from "../../@shared/NondeterministicFiniteAutomatonTransformer";

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
        const transformer = new NondeterministicFiniteAutomatonTransformer(this);
        return transformer.toDeterministicFiniteAutomaton();
    }

    // δn(S,a)=∪δm(p,a), p in S
    deltaTransition(state: string | Set<string | number> | number, symbol: string) {
        state = this.ensureStateIsAState(state);
        let accumulator = new Set<string>();
        state.forEach((rState) => {
            if(this.delta[rState] !== undefined || symbol !== '') {
                accumulator = union(accumulator, this.delta[rState][symbol] as Set<string>);
            }
        });
        return accumulator;
    }



    private ensureStateIsAState(state: string | Set<string | number> | number) {
        if (typeof state == "number" || typeof state == "string") {
            state = new Set<string | number>([state]);
        }
        return state;
    }

    private ensureAlphabetIsInDelta() {
        this.alphabet.forEach((symbol) =>
            this.states.forEach((state) => this.delta[state][symbol] = this.buildSetFrom(state, symbol))
        );
    }

    private buildSetFrom(state: string, symbol: string): Set<string> {
        if (this.delta[state] === undefined || !this.delta[state].hasOwnProperty(symbol)) {
            return new Set<string>();
        }
        if (typeof this.delta[state][symbol] === "string" || typeof this.delta[state][symbol] === "number") {
            return new Set<string>([this.getState(state, symbol) as string]);
        }
        if (Array.isArray(this.delta[state][symbol])) {
            return new Set<string>(this.delta[state][symbol] as unknown as string[]);
        }
        return this.delta[state][symbol] as Set<string>;
    }
}