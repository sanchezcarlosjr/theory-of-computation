import {FiniteAutomaton} from "./FiniteAutomaton";
import {Queue} from "../../@shared/Queue";
import {isEqual} from "lodash";
import {difference} from "../../@shared/SetOperations";

export class DeterministicFiniteAutomaton extends FiniteAutomaton {
    accepts(symbol: string): boolean {
        return false;
    }

    transit(symbol: string): void {
    }

    iterate(f: (state: string, symbol: string, rState: string) => void): void {
        this.states?.forEach((state) => this.alphabet.forEach(
            (symbol) => f(state, symbol, this.getState(state, symbol) as string)
            )
        );
    }

    minimize() {
        return this.removeEquivalentStates().removeUnreachableStates();
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
            const currentState = queue.dequeue();
            finiteAutomaton.alphabet.forEach((symbol) => {
                const state = this.identifyStateIn(currentState, symbol);
                if (!visitedStates[state]) {
                    visitedStates[state] = true
                    queue.enqueue(state);
                }
            });
        }
        this.states.forEach((state) => {
            if (!visitedStates[state]) {
                delete finiteAutomaton._delta[state];
            }
            if (visitedStates[state] && this.isAnAcceptingState(state)) {
                finiteAutomaton._delta[state]["accept"] = true;
            }
        });
        return new DeterministicFiniteAutomaton(finiteAutomaton._delta, finiteAutomaton._startState);
    }

    determineInitialPartition(): Set<string>[] {
        return [this.accepting_states, difference(this.states, this.accepting_states)];
    }

    findEquivalentStates() {
        let currentPartition = this.determineInitialPartition();
        const history: Set<string>[][] = [];
        const alphabet = Array.from(this.alphabet);
        let previousPartition = null;
        while (!isEqual(previousPartition, currentPartition)) {
            history.push(currentPartition);
            const whereIsState: { [state: string]: string } = {};
            this.states.forEach((state) =>
                history[history.length-1].forEach((subPartition: Set<string>, index: number) => {
                    if (subPartition.has(state)) {
                        whereIsState[state] = index.toString();
                    }
                })
            );
            const newPartition: Set<string>[] = [];
            currentPartition.forEach((subPartition) => {
                const newStateTable: { [key: string]: string[] } = {};
                subPartition.forEach((state) => {
                    const key = alphabet.reduce((acc, symbol) =>
                        [...acc, whereIsState[this.delta[state][symbol] as string]], [] as string[]).sort().join("");
                    newStateTable[key] = [...(newStateTable[key] ?? []), state];
                });
                Object.keys(newStateTable).forEach((newStatePartition) => {
                    newPartition.push(new Set<string>(newStateTable[newStatePartition]));
                });
            });
            previousPartition = currentPartition;
            currentPartition = newPartition;
        }
        return history.map((partition) => partition.map((subPartition) => Array.from(subPartition)));
    }

    removeEquivalentStates() {
        const finiteAutomaton = this.clone();
        const history = this.findEquivalentStates();
        const hashTable: { [state: string]: string } = {};
        history[history.length - 1].forEach((partition) => {
            const defaultKey = partition[0];
            partition.forEach((state) => hashTable[state] = defaultKey);
        });
        this.states.forEach((state) => {
                if (this.isAnAcceptingState(state)) {
                    finiteAutomaton.delta[state]["accept"] = true;
                }
                this.alphabet.forEach((symbol) => finiteAutomaton.delta[state][symbol] = hashTable[this.delta[state][symbol] as string])
            }
        );
        return new DeterministicFiniteAutomaton(finiteAutomaton.delta, finiteAutomaton._startState);
    }
}