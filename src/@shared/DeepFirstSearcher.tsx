import {Graph} from "./Graph";

export class DeepFirstSearcher {
    private stack: any[] = [];
    private records = new Set<any>();
    constructor(private graph: Graph) {
    }
    makeANewGraph() {
        let current_vertex = this.graph.getInitialNode();
        console.log(current_vertex);
        do {
            do {
                while (
                    current_vertex !== undefined &&
                    !this.records.has(current_vertex)
                    ) {
                    this.record(current_vertex);
                    this.relax();
                    if (this.graph.isAGoal(current_vertex)) {
                        return this.graph.reconstruct_path(current_vertex);
                    }
                    current_vertex = this.graph.exploreNeighbor(current_vertex);
                }
            } while ((current_vertex = this.graph.exploreNeighbor(this.stack[this.stack.length - 1])) !== undefined);
            this.stack.pop();
            current_vertex = this.graph.exploreNeighbor(this.stack[this.stack.length - 1]);
        } while (this.stack.length > 0);
        return this.stack;
    }

    private record(current_vertex: string) {
        this.stack.push(current_vertex);
        this.records.add(current_vertex);
    }

    private relax() {
        if (this.stack.length >= 2) {
            this.graph.relax(this.stack[this.stack.length - 2], this.stack[this.stack.length - 1]);
        }
    }
}