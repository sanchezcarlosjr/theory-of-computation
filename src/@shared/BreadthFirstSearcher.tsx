import {Queue} from "./Queue";

export abstract class Graph {
    abstract getAdjacentEdges(node?: any): Array<any>|Set<any>;
    abstract getInitialNode(): any;
    abstract setUpKey(currentNode: any): void;
    abstract makeANewNode(currentNode: any, edge: any): any;
}

export class BreadthFirstSearcher {
    constructor(private graph: Graph) {
    }
    makeANewGraph() {
        const visitedNodes = new Set<string>();
        const queue = new Queue<any>(this.graph.getInitialNode());
        while (!queue.isEmpty()) {
            const currentNode = queue.dequeue();
            this.graph.setUpKey(currentNode);
            const edges = this.graph.getAdjacentEdges(currentNode);
            for (const edge of edges) {
                const [newReachableNode, keyNode] = this.graph.makeANewNode(currentNode, edge);
                if (!visitedNodes.has(keyNode)) {
                    visitedNodes.add(keyNode);
                    queue.enqueue(newReachableNode);
                }
            }
        }
    }
}