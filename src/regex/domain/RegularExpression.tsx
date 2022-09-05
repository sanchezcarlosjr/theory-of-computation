import {NondeterministicFiniteAutomaton} from "../../automata/domain/NondeterministicFiniteAutomaton";
import {Delta} from "../../automata/domain/Delta";

export abstract class RegularExpressionSymbol {
    constructor(protected _lexeme: string = "") {
    }

    get lexeme() {
        return this._lexeme;
    }

    get isExpression(): boolean {
        return false;
    }

    abstract parse(stack: Operator[]): RegularExpressionSymbol[];

    toStringState(state: number) {
        return [state.toString(), (state + 1).toString()];
    }

    generateMachine(stack: Machine[], state: number): number {
        return state;
    }

}

class Operator extends RegularExpressionSymbol {
    get PRECEDENCE() {
        return -1;
    }

    parse(stack: Operator[]) {
        if (stack.length === 0) {
            stack.push(this);
            return [];
        }
        const postfixExpression: RegularExpressionSymbol[] = [];
        while (stack.length > 0 && this.PRECEDENCE <= stack[stack.length - 1].PRECEDENCE) {
            postfixExpression.push(stack.pop() as Operator);
        }
        stack.push(this);
        return postfixExpression;
    }
}

export class KleeneStar extends Operator {
    public get PRECEDENCE() {
        return 5;
    }

    get isExpression(): boolean {
        return true;
    }

    generateMachine(stack: Machine[], state: number): number {
        const machine = stack.pop();
        if (machine === undefined) {
            return state;
        }
        machine.delta[machine.final_state][""] = [...(machine.delta[machine.final_state][""] as Iterable<any> ?? []), machine.start_state];
        machine.delta[machine.start_state][""] = [...(machine.delta[machine.start_state][""] as Iterable<any> ?? []), machine.final_state];
        stack.push({
            delta: {
                ...machine.delta
            },
            start_state: machine.start_state, final_state: machine.final_state
        });
        return state;
    }
}

export class Lazy extends Operator {
    public get PRECEDENCE() {
        return 5;
    }

    generateMachine(stack: Machine[], state: number): number {
        const [_, newState] = this.toStringState(state);
        const machine = stack.pop();
        if (machine === undefined) {
            return state;
        }
        machine.delta[machine.final_state][""] = [...(machine.delta[machine.final_state][""] as Iterable<any> ?? []), newState];
        machine.delta[machine.start_state][""] = [...(machine.delta[machine.start_state][""] as Iterable<any> ?? []), newState];
        stack.push({
            delta: {
                ...machine.delta,
                [newState]: {}
            }, start_state: machine.start_state, final_state:  newState
        });
        return state + 1;
    }

}

export class Union extends Operator {
    public get PRECEDENCE() {
        return 2;
    }

    generateMachine(stack: Machine[], state: number): number {
        const [currentState, newState] = this.toStringState(state);
        const machine1 = stack.pop();
        const machine2 = stack.pop();
        if (machine1 === undefined || machine2 === undefined) {
            return state;
        }
        machine1.delta[machine1.final_state][""] = [...(machine1.delta[machine1.final_state][""] as Iterable<any> ?? []), newState];
        machine2.delta[machine2.final_state][""] = [...(machine2.delta[machine2.final_state][""] as Iterable<any> ?? []), newState];
        stack.push({
            delta: {
                ...machine1.delta,
                ...machine2.delta, [currentState]: {
                    "": [machine1.start_state, machine2.start_state]
                }, [newState]: {}
            }, start_state: currentState, final_state: newState
        });
        return state + 2;
    }
}

export class Concatenation extends Operator {
    public get PRECEDENCE() {
        return 3;
    }

    generateMachine(stack: Machine[], state: number): number {
        const e2 = stack.pop();
        const e1 = stack.pop();
        if (e2 === undefined || e1 === undefined) {
            return state;
        }
        e1.delta[e1.final_state][""] = [...(e1.delta[e1.final_state][""] as Iterable<any> ?? []), e2.start_state];
        stack.push({
            delta: {
                ...e1?.delta, ...e2?.delta
            },
            start_state: e1.start_state, final_state: e2.final_state
        });
        return state;
    }
}

export class LeftParenthesis extends Operator {
    public get PRECEDENCE() {
        return 1;
    }

    parse(stack: Operator[]): RegularExpressionSymbol[] {
        stack.push(this);
        return [];
    }
}

export class Plus extends Operator {
    public get PRECEDENCE() {
        return 5;
    }

    get isExpression(): boolean {
        return true;
    }

    generateMachine(stack: Machine[], state: number): number {
        const machine = stack.pop();
        if (machine === undefined) {
            return state;
        }
        machine.delta[machine.final_state][""] = [...(machine.delta[machine.final_state][""] as Iterable<any> ?? []), machine.start_state];
        stack.push({
            delta: {
                ...machine.delta
            },
            start_state: machine.start_state,
            final_state: machine.final_state
        });
        return state;
    }
}

export class RightParenthesis extends Operator {
    public get PRECEDENCE() {
        return 1;
    }

    get isExpression(): boolean {
        return true;
    }

    parse(stack: Operator[]): RegularExpressionSymbol[] {
        let operator = stack.pop();
        let postfixExpression: RegularExpressionSymbol[] = [];
        while (!(operator instanceof LeftParenthesis)) {
            postfixExpression.push(operator as Operator);
            operator = stack.pop();
        }
        return postfixExpression;
    }
}

export class Atomic extends RegularExpressionSymbol {
    get isExpression(): boolean {
        return true;
    }

    parse(stack: Operator[]): RegularExpressionSymbol[] {
        return [this];
    }

    generateMachine(stack: Machine[], state: number): number {
        const [currentState, newState] = this.toStringState(state);
        stack.push({
            delta: {
                [currentState]: {[this.lexeme]: newState}, [newState]: {}
            }, start_state: currentState, final_state: newState
        });
        return state + 2;
    }
}

class EmptyString extends Atomic {
    constructor() {
        super("");
    }
}


interface Machine {
    delta: Delta;
    start_state: string;
    final_state: string;
}

export class RegularExpression {
    private parenthesis = 0;

    constructor(private stream: string = "ϵ") {
    }

    private _symbols: RegularExpressionSymbol[] = [];

    get symbols(): RegularExpressionSymbol[] {
        return this._symbols;
    }

    compile(): NondeterministicFiniteAutomaton {
        this._symbols = this.scan(this.stream);
        if (this.parenthesis !== 0) {
            throw new Error('Error in scanning. A parenthesis is wrong.');
        }
        this._symbols = this.parse();
        return this.generateNondeterministicFiniteAutomaton();
    }

    scan(stream: string): RegularExpressionSymbol[] {
        let state = 0;
        return stream.split('').reduce((symbols: RegularExpressionSymbol[], character: string, currentIndex) => {
            return [...symbols, ...((() => {
                switch (true) {
                    case character === "*" && state === 0:
                        return [new KleeneStar()];
                    case character === "+" && state === 0:
                        return [new Plus()];
                    case (character === "|" || character === "∪") && state === 0:
                        return [new Union()];
                    case character === '?' && state === 0:
                        return [new Lazy()];
                    case character === ")" && state === 0:
                        this.parenthesis--;
                        return [new RightParenthesis()];
                    case character === 'ϵ' || character === 'λ' || character === '':
                        return [new EmptyString()];
                    case character === "(" && state === 0:
                        this.parenthesis++;
                        if (symbols.length > 0 && symbols[symbols.length - 1].isExpression) {
                            return [new Concatenation(), new LeftParenthesis()];
                        }
                        return [new LeftParenthesis()];
                    case character === "\\":
                        state = 1;
                        return [];
                    default:
                        state = 0;
                        if (symbols.length > 0 && symbols[symbols.length - 1].isExpression) {
                            return [new Concatenation(), new Atomic(character)];
                        }
                        return [new Atomic(character)];
                }
            })())];
        }, []);
    }

    generateNondeterministicFiniteAutomaton(): NondeterministicFiniteAutomaton {
        const stack: Machine[] = [];
        let state = 0;
        for (const symbol of this._symbols) {
            state = symbol.generateMachine(stack, state);
        }
        const machine = stack.pop();
        if (machine === undefined) {
            return new NondeterministicFiniteAutomaton({}, "q0");
        }
        machine.delta[machine.final_state]['accept'] = true;
        return new NondeterministicFiniteAutomaton(machine.delta, machine.start_state);
    }

    parse() {
        const stack: Operator[] = [];
        const postfixExpression: RegularExpressionSymbol[] = [];
        for (const symbol of this._symbols) {
            postfixExpression.push(...symbol.parse(stack));
        }
        while (stack.length > 0) {
            postfixExpression.push(stack.pop() as Operator);
        }
        return postfixExpression;
    }

}