import {BreadthFirstSearcher, Graph} from "../../@shared/BreadthFirstSearcher";
import {Grammar} from "./Grammar";

interface ConfigurationOfAShiftReduceParserAction {
    type: 'shift' | 'reduce' | 'accept' | 'backtracking';
    by?: number;
}

export interface ConfigurationOfAShiftReduceParser {
    stack: string[];
    input: string[];
    action: ConfigurationOfAShiftReduceParserAction;
}

export interface Tree {
    id: number;
    label: string;
    children?: number[];
}

export class ParseTree extends Graph {
    private tree: Tree[] = [];
    private node = 0;
    private stack: string[] = [];
    private input: string[] = [];

    private _configurations: ConfigurationOfAShiftReduceParser[] = [];

    get configurations(): ConfigurationOfAShiftReduceParser[] {
        return this._configurations;
    }

    private _accepts: boolean = false;

    get accepts(): boolean {
        return this._accepts;
    }

    private _grammar: Grammar | undefined;

    get grammar(): Grammar {
        return this._grammar as Grammar;
    }

    set grammar(value: Grammar | undefined) {
        this._grammar = value;
    }

    bindStack(stack: string[]) {
        this.stack = stack;
    }

    bindInput(input: string[]) {
        this.input = input;
    }

    bindAction(action: ConfigurationOfAShiftReduceParserAction) {
        if (action.type === "accept") {
            this._accepts = true;
        }
        this.record({
            stack: this.stack, action, input: this.input
        });
    }

    record(configuration: ConfigurationOfAShiftReduceParser) {
        this._configurations.push(configuration);
    }

    buildParseTree(): Tree[] {
        if (!this.accepts) {
            return this.tree;
        }
        const breadthFirstSearcher = new BreadthFirstSearcher(this);
        breadthFirstSearcher.makeANewGraph();
        return this.tree;
    }

    getAdjacentEdges(node: Tree): Array<Tree> {
        if(node.children !== undefined) {
            const configuration = this.configurations
                .slice(0, this.configurations.length-node.id)
                .reverse()
                .find((configuration) =>
                    configuration.action.type === 'reduce' && configuration.action.by !== undefined && this.grammar.production_rules[configuration.action.by].isDerivativeBy(node.label)
                );
            if (configuration === undefined) {
                return [];
            }
            return this.grammar.production_rules[configuration.action.by ?? 0].normalFormRightSide.map((x, index) => {
                if (this.grammar.terminal_symbols.has(x)) {
                    return {
                        id: ++this.node,
                        label: x
                    };
                }
                return {
                    id: ++this.node,
                    label: x,
                    children: []
                };
            });
        }
        return [];
    }

    getInitialNode(): Tree {
        return {
            id: this.node,
            label: this.configurations[this.configurations.length - 1].stack[0],
            children: []
        };
    }

    makeANewNode(currentNode: Tree, edge: Tree): any {
        if(currentNode.children !== undefined) {
            currentNode.children?.push(edge.id);
        }
        return [edge, edge.id];
    }

    setUpKey(currentNode: Tree): void {
        this.tree.push(currentNode);
    }
}