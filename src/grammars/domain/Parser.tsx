import {Grammar} from "./Grammar";
import {ParseTree} from "./ParseTree";

export abstract class Parser {
    private _grammar: Grammar | undefined;

    get grammar(): Grammar {
        return this._grammar as Grammar;
    }

    set grammar(value: Grammar | undefined) {
        this._grammar = value;
    }

    abstract parse(str: string): ParseTree;
}