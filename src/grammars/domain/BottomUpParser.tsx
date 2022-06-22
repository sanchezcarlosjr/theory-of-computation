import {Parser} from "./Parser";
import {ParseTree} from "./ParseTree";
import {ProductionRule} from "./ProductionRule";

export class BottomUpParser extends Parser {
    private parseTree = new ParseTree();
    private stack: any = [];

    parse(str: string) {
        this.parseTree.grammar = this.grammar;
        const tokens: string[] = this.grammar.breakTokens(str);
        this.stack.push([[], -1, tokens]);
        do {
            let [[...phi], i, [...nu]] = this.stack.pop();
            let found = false;
            do {
                if (!found && nu.length > 0) {
                    this.parseTree.bindInput(nu);
                    this.parseTree.bindStack(phi);
                    this.parseTree.bindAction({type: "shift"});
                    [phi, nu] = this.shift([...phi], [...nu]);
                    i = -1;
                }
                this.parseTree.bindInput(nu);
                do {
                    [phi, found] = this.scan([...phi], i,[...nu]);
                } while (found);
            } while (nu.length > 0 && !this.grammar.nonterminal_symbols.isStartSymbol(phi.join("")));
            if (nu.length === 0 && this.grammar.nonterminal_symbols.isStartSymbol(phi.join(""))) {
                this.parseTree.bindInput(nu);
                this.parseTree.bindStack(phi);
                this.parseTree.bindAction({type: "accept"});
                return this.parseTree;
            }
            this.parseTree.bindInput(nu);
            this.parseTree.bindStack(phi);
            this.parseTree.bindAction({type: "backtracking"});
        } while(this.stack.length > 0);
        return this.parseTree;
    }

    private shift(phi: string[], nu: string[]) {
        phi.push(nu.shift() as string);
        return [phi, nu];
    }

    private scan(phi: string[], i: number, nu: string[]): [string[], boolean] {
        let j = i+1;
        let productionRule: ProductionRule | undefined = undefined;
        let potentialHandle: string = "";
        let n = 0;
        while (productionRule === undefined && n < phi.length) {
            potentialHandle = phi.slice(n, phi.length).join("");
            productionRule = this.grammar.production_rules.slice(j).find((rule) => rule.isReduceBy(potentialHandle));
            n++;
        }
        if (productionRule !== undefined) {
            this.parseTree.bindStack(phi);
            this.parseTree.bindAction({type: "reduce", by: productionRule.position});
            this.stack.push([phi, productionRule.position, nu]);
            const phi2 = [...phi];
            phi2.splice(n-1, phi.length, productionRule.inverse(potentialHandle));
            return [phi2, true];
        }
        return [phi, false];
    }
}