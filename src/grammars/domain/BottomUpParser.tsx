import {Parser} from "./Parser";
import {ParseTree} from "./ParseTree";
import {Graph} from "../../@shared/Graph";
import {DeepFirstSearcher} from "../../@shared/DeepFirstSearcher";
import {ProductionRule} from "./ProductionRule";

type nu = string[];
type rule = number;
type phi = string[];
type Node = [phi, rule, nu];

export class BottomUpParser extends Parser implements Graph {
    private parseTree = new ParseTree();
    private chain: Node[] = [];
    private tokens: string[] = [];

    parse(str: string) {
        this.parseTree.grammar = this.grammar;
        this.tokens = this.grammar.breakTokens(str);
        this.chain.push([[], -1, this.tokens]);
        // @ts-ignore
        const dfs = new DeepFirstSearcher(this);
        dfs.makeANewGraph();
        return this.parseTree;
    }
    private neighbors = new Map<number, Iterator<number>>();
    // @ts-ignore
    exploreNeighbor(current_vertex: number): number|undefined {
        if (!this.neighbors.has(current_vertex)) {
            this.scan(current_vertex);
        }
        const neighbor = this.neighbors.get(current_vertex)?.next();
        if (neighbor?.done)
            return undefined;
        return neighbor?.value;
    }

    getAdjacentEdges(node?: any): Array<any> | Set<any> {
        return [];
    }

    private reduce(member: number) {
    }

    private scan(member: number) {
        const [[...phi], i, [...nu]] = this.chain[member];
        let j = i+1;
        let potentialHandle: string = "";
        let n = 0;
        while (n < phi.length) {
            potentialHandle = phi.slice(n, phi.length).join("");
            const productionRule = this.grammar.production_rules.slice(j).find((rule) => rule.isReduceBy(potentialHandle));
            if (productionRule !== undefined)
                this.chain.push([phi, productionRule.position, nu]);
            n++;
        }
        phi.push(nu.shift() as string);
    }

    getInitialNode(): any {
        return ;
    }

    // @ts-ignore
    isAGoal(current_vertex: Node): boolean {
        return true;
    }

    makeANewNode(currentNode: any, edge: any): any {
    }
// @ts-ignore
    reconstruct_path(goal: Node): string[] {
        return [];
    }
// @ts-ignore
    relax(u: Node, v: Node): void {
    }

    setUpKey(currentNode: Node): void {
    }
}