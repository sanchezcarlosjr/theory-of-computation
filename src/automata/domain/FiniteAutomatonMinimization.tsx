import {FiniteAutomaton} from "./FiniteAutomaton";

export class FiniteAutomatonMinimization {
    private finiteAutomaton: FiniteAutomaton;

    constructor(finiteAutomaton: FiniteAutomaton) {
        this.finiteAutomaton = finiteAutomaton.clone();
    }

    minimize() {
    }

    removeUnreachableStates() {

    }

    initialPartition() {
    }
}