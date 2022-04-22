import {Delta} from "./Delta";
import {BreadthFirstSearcher, Graph} from "../../@shared/BreadthFirstSearcher";
import {intersection} from "../../@shared/SetOperations";
import {DeterministicFiniteAutomaton} from "./DeterministicFiniteAutomaton";
import {NondeterministicFiniteAutomaton} from "./NondeterministicFiniteAutomaton";

export class NondeterministicFiniteAutomatonTransformer extends Graph {
    private delta: Delta = {};
    private key: string = "";
    private readonly alphabet = new Set<string>();
    private readonly startState = this.automaton.reachesEpsilonClosureStates(this.automaton.startState);

    constructor(
        protected automaton: NondeterministicFiniteAutomaton
    ) {
        super();
        this.alphabet = new Set<string>(this.automaton.alphabet);
        this.alphabet.delete('');
    }

    getInitialNode() {
        return this.startState;
    }

    generateKey(newStates: Set<string|number>): string {
        if(newStates.size === 0) {
            return "NULL";
        }
        return [...newStates].sort().join("");
    }

    setUpKey(newStates: Set<string>) {
        this.key = this.generateKey(newStates);
        this.makeNewKey();
        this.makeNewStateAcceptor(newStates);
    }

    toDeterministicFiniteAutomaton(): DeterministicFiniteAutomaton {
        const breadthFirstSearcher = new BreadthFirstSearcher(this);
        breadthFirstSearcher.makeANewGraph();
        return new DeterministicFiniteAutomaton(this.delta, Array.from(this.startState).sort().join(""));
    }

    getAdjacentEdges(): Array<any> | Set<any> {
        return this.alphabet;
    }

    makeANewNode(currentState: Set<string>, symbol: string) {
        const transition = this.automaton.deltaTransition(currentState, symbol) as Set<string>;
        const newReachableStates = this.automaton.reachesEpsilonClosureStates(transition);
        const newKey = this.generateKey(newReachableStates);
        this.delta[this.key][symbol] = newKey;
        return [newReachableStates, newKey];
    }

    private makeNewKey() {
        this.delta[this.key] = {};
    }

    private makeNewStateAcceptor(states: Set<string>) {
        if (intersection(this.automaton.accepting_states, states).size > 0) {
            this.delta[this.key]["accept"] = true;
        }
    }
}