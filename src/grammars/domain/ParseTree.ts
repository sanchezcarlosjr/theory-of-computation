interface ConfigurationOfAShiftReduceParserAction {
    type: 'shift' | 'reduce' | 'accept' | 'backtracking';
    by?: number;
}

export interface ConfigurationOfAShiftReduceParser {
    stack: string;
    input: string;
    action: ConfigurationOfAShiftReduceParserAction;
}

export class ParseTree {
    private stack: string = "";
    private input: string = "";

    private _configurations: ConfigurationOfAShiftReduceParser[] = [];

    get configurations(): ConfigurationOfAShiftReduceParser[] {
        return this._configurations;
    }

    private _accepts: boolean = false;

    get accepts(): boolean {
        return this._accepts;
    }

    bindStack(stack: string) {
        this.stack = stack;
    }

    bindInput(input: string) {
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
}