import {Delta} from "../automata/domain/Delta";
import {NondeterministicFiniteAutomaton} from "../automata/domain/NondeterministicFiniteAutomaton";
import {intersection} from "./SetOperations";
import {BreadthFirstSearcher, Graph} from "./BreadthFirstSearcher";
import {DeterministicFiniteAutomaton} from "../automata/domain/DeterministicFiniteAutomaton";

export class NondeterministicFiniteAutomatonTransformer extends Graph {
    private delta: Delta = {};
    private key: string = "";

    constructor(
        private automaton: NondeterministicFiniteAutomaton
    ) {
        super();
    }

    getInitialNode() {
        return new Set<string>([this.automaton.startState]);
    }

    generateKey(newStates: Set<string>): string {
        return [...newStates].sort().join("");
    }

    setUpKey(newStates: Set<string>) {
        this.key = this.generateKey(newStates);
        this.makeNewKey();
        this.makeNewStateAcceptor(newStates);
    }

    private makeNewKey() {
        this.delta[this.key] = {};
    }

    private makeNewStateAcceptor(states: Set<string>) {
        if (intersection(this.automaton.accepting_states, states).size > 0) {
            this.delta[this.key]["accept"] = true;
        }
    }

    toDeterministicFiniteAutomaton(): DeterministicFiniteAutomaton {
        const breadthFirstSearcher = new BreadthFirstSearcher(this);
        breadthFirstSearcher.makeANewGraph();
        return new DeterministicFiniteAutomaton(this.delta, this.automaton.startState);
    }

    getAdjacentEdges(): Array<any> | Set<any> {
        return this.automaton.alphabet;
    }

    makeANewNode(currentState: Set<string>, symbol: string) {
        const newReachableStates = this.automaton.deltaTransition(currentState, symbol) as Set<string>;
        const newKey = this.generateKey(newReachableStates);
        this.delta[this.key][symbol] = newKey;
        return [newReachableStates, newKey];
    }
}