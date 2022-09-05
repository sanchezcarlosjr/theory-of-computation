import {NondeterministicFiniteAutomaton} from "../../automata/domain/NondeterministicFiniteAutomaton";
import {Delta} from "../../automata/domain/Delta";

export abstract class RegularExpressionSymbol {
    constructor(protected _lexeme: string = "") {
    }

    get lexeme() {
        return this._lexeme;
    }
}

class Operator extends RegularExpressionSymbol {
    get PRECEDENCE() {
        return -1;
    }
}

export class KleeneStar extends Operator {
    public get PRECEDENCE() {
        return 5;
    }

    static is(character: string) {
        return character === "*";
    }
}

export class Union extends Operator {
    public get PRECEDENCE() {
        return 2;
    }

    static is(character: string) {
        return character === "|";
    }
}

export class Concatenation extends Operator {
    public get PRECEDENCE() {
        return 3;
    }
}

export class LeftParenthesis extends Operator {
    public get PRECEDENCE() {
        return 1;
    }

    static is(character: string) {
        return character === "(";
    }
}

export class Plus extends Operator {
    public get PRECEDENCE() {
        return 4;
    }

    static is(character: string) {
        return character === "+";
    }
}

export class RightParenthesis extends Operator {
    public get PRECEDENCE() {
        return 1;
    }

    static is(character: string) {
        return character === ")";
    }
}

export class Atomic extends RegularExpressionSymbol {
}


export class RegularExpression {
    private _symbols: RegularExpressionSymbol[] = [];

    constructor(private stream: string) {
    }

    get symbols(): RegularExpressionSymbol[] {
        return this._symbols;
    }

    compile(): NondeterministicFiniteAutomaton {
        if (this.stream === undefined) {
            return new NondeterministicFiniteAutomaton({}, 'q0');
        }
        this._symbols = this.scan(this.stream);
        this._symbols = this.parse();
        return this.generateNondeterministicFiniteAutomaton();
    }

    scan(stream: string): RegularExpressionSymbol[] {
        if (stream === undefined) {
            return [];
        }
        return stream.split('').reduce((symbols: RegularExpressionSymbol[], character: string, currentIndex) => {
            return [...symbols, ...((() => {
                switch (true) {
                    case KleeneStar.is(character):
                        return [new KleeneStar()];
                    case Plus.is(character):
                        return [new Plus()];
                    case Union.is(character):
                        return [new Union()];
                    case RightParenthesis.is(character):
                        return [new RightParenthesis()];
                    case LeftParenthesis.is(character):
                        if (symbols[symbols.length - 1] instanceof Atomic || symbols[symbols.length - 1] instanceof Plus || symbols[symbols.length - 1] instanceof RightParenthesis || symbols[symbols.length - 1] instanceof KleeneStar) {
                            return [new Concatenation(), new LeftParenthesis()];
                        }
                        return [new LeftParenthesis()];
                    default:
                        if (symbols[symbols.length - 1] instanceof Atomic || symbols[symbols.length - 1] instanceof Plus || symbols[symbols.length - 1] instanceof RightParenthesis || symbols[symbols.length - 1] instanceof KleeneStar) {
                            return [new Concatenation(), new Atomic(character)];
                        }
                        return [new Atomic(character)];
                }
            })())];
        }, []);
    }

    generateNondeterministicFiniteAutomaton(): NondeterministicFiniteAutomaton {
        const stack: { delta: Delta, start_state: string, final_state: string }[] = [];
        let state = 0;
        for (const symbol of this._symbols) {
            const currentState  = state.toString();
            const newState = (state+1).toString();
            switch (true) {
                case symbol instanceof KleeneStar: {
                    const e1 = stack.pop();
                    //@ts-ignore
                    e1.delta[e1.final_state][""] = [...(e1.delta[e1.final_state][""] ?? []), currentState];
                    stack.push({
                        delta: {
                            // @ts-ignore
                            ...e1.delta,
                            [currentState]: {
                                // @ts-ignore
                                "": [e1.start_state, newState]
                            },
                            [newState]: {}
                        }, start_state: currentState, final_state: newState
                    });
                    state += 2;
                    break;
                }
                case symbol instanceof Union: {
                    const e1 = stack.pop();
                    // @ts-ignore
                    e1.delta[e1.final_state][""] = [...(e1.delta[e1.final_state][""] ?? []), newState];
                    const e2 = stack.pop();
                    // @ts-ignore
                    e2.delta[e2.final_state][""] = [...(e1.delta[e1.final_state][""] ?? []), newState];
                    stack.push({
                        delta: {
                            // @ts-ignore
                            ...e1.delta,
                            // @ts-ignore
                            ...e2.delta,
                            [currentState]: {
                                // @ts-ignore
                                "": [e1.start_state, e2.start_state]
                            },
                            [newState]: {}
                        }, start_state: currentState, final_state: newState
                    });
                    state += 2;
                    break;
                }
                case symbol instanceof Concatenation: {
                    const e1 = stack.pop();
                    const e2 = stack.pop();
                    // @ts-ignore
                    e1.delta[e1.final_state][""]  = [...(e1.delta[e1.final_state][""] ?? []), e2.start_state];
                    stack.push({
                        delta: {
                            ...e1?.delta,
                            ...e2?.delta
                        },
                        // @ts-ignore
                        start_state: e1.start_state, final_state: e2.final_state
                    });
                    break;
                }
                default: {
                    stack.push({
                        delta: {
                            [currentState]: {[symbol.lexeme]: newState},
                            [newState]: {}
                        }, start_state: currentState, final_state: newState
                    });
                    state += 2;
                    break;
                }
            }
        }
        const e1 = stack.pop();
        // @ts-ignore
        e1.delta[e1.final_state]['accept']= true;
        // @ts-ignore
        return new NondeterministicFiniteAutomaton(e1.delta, e1.start_state);
    }

    parse() {
        const stack: Operator[] = [];
        const postfixExpression: RegularExpressionSymbol[] = [];
        for (const symbol of this._symbols) {
            switch (true) {
                case symbol instanceof LeftParenthesis:
                    stack.push(symbol as LeftParenthesis);
                    break;
                case symbol instanceof RightParenthesis:
                    let operator = stack.pop();
                    while (!(operator instanceof LeftParenthesis)) {
                        postfixExpression.push(operator as Operator);
                        operator = stack.pop();
                    }
                    break;
                case symbol instanceof Operator && stack.length === 0:
                    stack.push(symbol as Operator);
                    break;
                case symbol instanceof Operator:
                    while (stack.length > 0 && (symbol as Operator).PRECEDENCE <= stack[stack.length - 1].PRECEDENCE) {
                        postfixExpression.push(stack.pop() as Operator);
                    }
                    stack.push(symbol as Operator);
                    break;
                case !(symbol instanceof Operator):
                    postfixExpression.push(symbol);
                    break;
            }
        }
        while (stack.length > 0) {
            postfixExpression.push(stack.pop() as Operator);
        }
        return postfixExpression;
    }

}