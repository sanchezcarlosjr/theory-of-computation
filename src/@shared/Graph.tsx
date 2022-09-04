export abstract class Graph {
    abstract getAdjacentEdges(node?: any): Array<any> | Set<any>;

    abstract getInitialNode(): any;

    abstract setUpKey(currentNode: any): void;

    abstract makeANewNode(currentNode: any, edge: any): any;

    relax(u: string, v: string) {}

    isAGoal(current_vertex: string) {
        return false;
    }

    reconstruct_path(goal: string): string[] {
        return [];
    }

    exploreNeighbor(current_vertex: string) {
        return "";
    }
}