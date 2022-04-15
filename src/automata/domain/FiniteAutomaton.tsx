import {Delta} from "./Delta";

export abstract class FiniteAutomaton {
    protected actualState = this.startState;
    protected alphabet = new Set<string>();
    protected states = new Set<string>();

    constructor(
        protected delta: Delta,
        protected readonly startState: string
    ) {
        const states = Object.keys(this.delta);
        const alphabet = states.reduce((acc: string[], state) => [...acc, ...Object.keys(this.delta[state])], [] as string[]);
        this.alphabet = new Set<string>(alphabet);
        this.states = new Set<string>(states);
    }
    abstract transit(symbol: string): void
    abstract accepts(symbol: string): boolean
    reset() {
        this.actualState = this.startState;
    }
}