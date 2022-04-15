import {FiniteAutomaton} from "./FiniteAutomaton";

export class DeterministicFiniteAutomaton extends FiniteAutomaton {
    accepts(symbol: string): boolean {
        return false;
    }

    transit(symbol: string): void {
    }
}