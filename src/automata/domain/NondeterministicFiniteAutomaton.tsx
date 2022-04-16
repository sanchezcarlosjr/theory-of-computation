import {FiniteAutomaton} from "./FiniteAutomaton";
import {DeterministicFiniteAutomaton} from "./DeterministicFiniteAutomaton";
import {Queue} from "../../@shared/Queue";
import {Delta} from "./Delta";
import {union} from "../../@shared/SetUnion";


export class NondeterministicFiniteAutomaton extends FiniteAutomaton {
    constructor(delta: Delta, startState: string = "") {
        super(delta, startState);
        this.ensureIsASet();
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
        const startState = `{${this.startState}}`;
        while (!queue.isEmpty()) {
            const states = queue.dequeue();
            const key = `{${[...states].join(",")}}`;
            delta[key] = {};
            this.alphabet.forEach((symbol) => {
                const rState = this.deltaTransition(states, symbol);
                const newKey = `{${[...rState as Set<string>].sort().join(",")}}`;
                delta[key][symbol] = newKey;
                if (!visitedStates.has(newKey)) {
                    visitedStates.add(newKey);
                    queue.enqueue(rState as Set<string>);
                }
            });
        }
        return new DeterministicFiniteAutomaton(delta, startState);
    }


    private ensureIsASet() {
        Object.keys(this.delta).forEach((state) =>
            Object.keys(this.delta[state]).forEach((symbol) => {
                if (Array.isArray(this.delta[state][symbol])) {
                    this.delta[state][symbol] = new Set<string>(this.delta[state][symbol] as unknown as string[]);
                    return;
                }
                if (typeof this.delta[state][symbol] === "string" || typeof this.delta[state][symbol] === "number") {
                    this.delta[state][symbol] = new Set<string>([this.delta[state][symbol] as string]);
                    return;
                }
                if (!this.delta[state].hasOwnProperty(symbol)) {
                    this.delta[state][symbol] = new Set<string>();
                }
            })
        );
    }

    // δn(S,a)=∪δm(p,a), p in S
    deltaTransition(state: string|Set<string|number>|number, symbol: string) {
        if(typeof state == "number" || typeof state == "string") {
            state = new Set<string|number>([state]);
        }
        let temp = new Set<string>();
        state.forEach((rState) => {
            temp = union(temp, this.delta[rState][symbol] as Set<string>);
        });
        return temp;
    }
}