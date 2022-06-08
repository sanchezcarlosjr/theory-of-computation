export class GrammarTypeAutomaton {
    actualState = 3;
    states: { [key: number]: any } = {
        0: {
            0: 0, 1: 0, 2: 0, 3: 0, 3.1: 0, 3.2: 0, "response": 0
        }, 1: {
            0: 0, 1: 1, 2: 1, 3: 1, 3.1: 1, 3.2: 1, "response": 1
        }, 2: {
            0: 0, 1: 1, 2: 2, 3: 2, 3.1: 2, 3.2: 2, "response": 2
        }, 3.1: {
            0: 0, 1: 1, 2: 2, 3: 3.1, 3.1: 3.1, 3.2: 2, "response": 3.1
        }, 3.2: {
            0: 0, 1: 1, 2: 2, 3: 3.2, 3.1: 2, 3.2: 3.1, "response": 3.2
        }, 3: {
            0: 0, 1: 1, 2: 2, 3: 3, 3.1: 3.1, 3.2: 3.2, "response": 3
        }
    };

    get type(): number {
        return this.states[this.actualState]["response"];
    }

    transit(type_rule: number) {
        this.actualState = this.states[this.actualState][type_rule];
    }
}