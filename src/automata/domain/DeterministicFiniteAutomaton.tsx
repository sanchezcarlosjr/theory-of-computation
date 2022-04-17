import {FiniteAutomaton} from "./FiniteAutomaton";
import {Queue} from "../../@shared/Queue";

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

    minimize() {
    }

    identifyStateIn(state: string, symbol: string) {
        return this.delta[state][symbol] as string;
    }

    removeUnreachableStates() {
        const finiteAutomaton = this.clone();
        const visitedStates: { [state: string]: boolean } =
            finiteAutomaton.states_as_array.reduce((acc, actualState) => ({...acc, [actualState]: false}), {});
        visitedStates[finiteAutomaton.startState] = true;
        const queue = new Queue<string>();
        queue.enqueue(finiteAutomaton.startState);
        while (!queue.isEmpty()) {
            const currentState =  queue.dequeue();
            finiteAutomaton.alphabet.forEach((symbol) => {
                const state = this.identifyStateIn(currentState, symbol);
                if(!visitedStates[state]) {
                    visitedStates[state] = true
                    queue.enqueue(state);
                }
            });
        }
        this.states.forEach((state) => {
            if(!visitedStates[state]) {
                delete finiteAutomaton._delta[state];
            }
            if(visitedStates[state] && this.accepting_states.has(state)) {
                finiteAutomaton._delta[state]["accept"] = true;
            }
        });
        return new DeterministicFiniteAutomaton(finiteAutomaton._delta, finiteAutomaton._startState);
    }
}