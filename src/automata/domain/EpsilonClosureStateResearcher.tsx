import {BreadthFirstSearcher, Graph} from "../../@shared/BreadthFirstSearcher";
import {NondeterministicFiniteAutomaton} from "./NondeterministicFiniteAutomaton";

export class EpsilonClosureStateResearcher extends Graph {
    private states = new Set<string | number>();
    private initialNode: string | number = '';

    constructor(protected automaton: NondeterministicFiniteAutomaton) {
        super();
    }

    getInitialNode() {
        return this.initialNode;
    }

    getAdjacentEdges(node: string): Array<any> | Set<any> {
        return this.automaton.deltaTransition(node, '') as Set<string>;
    }

    makeANewNode(currentNode: string, edge: string) {
        return [edge, edge];
    }

    reaches(states: Set<string | number>) {
        this.states = states;
        this.states.forEach((state) => {
            this.initialNode = state;
            const breadthFirstSearcher = new BreadthFirstSearcher(this);
            breadthFirstSearcher.makeANewGraph();
        });
        return this.states;
    }

    setUpKey(currentNode: string): void {
        this.states.add(currentNode);
    }
}