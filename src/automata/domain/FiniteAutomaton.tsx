import {Delta} from "./Delta";
import {clone} from 'lodash';

export abstract class FiniteAutomaton {
    private _alphabet = new Set<string>();
    private _states = new Set<string>();

    constructor(protected _delta: Delta, protected _startState: string = "") {
        this.buildFiniteAutomaton();
    }

    protected buildFiniteAutomaton() {
        const states = Object.keys(this._delta);
        if (!this._startState) {
            this._startState = states[0];
        }
        states.forEach((state) => {
            if (this._delta[state]["accept"]) {
                this._accepting_states.add(state);
                delete this._delta[state]["accept"];
            }
        });
        const alphabet = states.reduce((acc: string[], state) => [...acc, ...Object.keys(this._delta[state])], [] as string[]);
        this._alphabet = new Set<string>(alphabet);
        this._states = new Set<string>(states);
    }

    get startState(): string {
        return this._startState;
    }

    getState(state: string, symbol: string) {
        if(this._delta[state] === undefined || this._delta[state][symbol] === undefined) {
            return state;
        }
        return this._delta[state][symbol];
    }

    get delta(): Delta {
        return this._delta;
    }

    private _actualState = this._startState;

    get actualState(): string {
        return this._actualState;
    }

    get alphabet(): Set<string> {
        return this._alphabet;
    }

    get states_as_array(): Array<string> {
        return Array.from(this.states);
    }

    get states(): Set<string> {
        return this._states;
    }

    private _accepting_states = new Set<string>();

    get accepting_states(): Set<string> {
        return this._accepting_states;
    }

    isStartState(state: string): boolean {
        return this._startState === state;
    }

    isAnAcceptingState(state: string): boolean {
        return this.accepting_states.has(state);
    }

    abstract transit(symbol: string): void

    abstract accepts(symbol: string): boolean

    abstract iterate(f: (state: string, symbol: string, rState: string) => void): void

    reset() {
        this._actualState = this._startState;
    }

    clone() {
        return clone(this);
    }
}