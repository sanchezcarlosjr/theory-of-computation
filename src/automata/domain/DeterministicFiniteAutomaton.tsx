import {FiniteAutomaton} from "./FiniteAutomaton";

export class DeterministicFiniteAutomaton extends FiniteAutomaton {
    accepts(symbol: string): boolean {
        return false;
    }

    transit(symbol: string): void {
    }

    iterate(f: (state: string, symbol: string, rState: string) => void): void {
        this.states.forEach((state) => Object.keys(this.delta[state])
            .forEach((symbol) => {
                f(
                    state,
                    symbol,
                    (this.delta[state][symbol] as string));
            }));
    }
}