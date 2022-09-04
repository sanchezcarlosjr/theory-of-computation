export abstract class Symbol2 {
    constructor(protected lexeme?: any) {
    }
}

export class KleeneStar extends Symbol2 {
    static is(character: string) {
        return character === "*";
    }
}

export class Union extends Symbol2 {
    static is(character: string) {
        return character === "|";
    }
}

export class Concatenation extends Symbol2 {}

export class LeftParenthesis extends Symbol2 {
    static is(character: string) {
        return character === "(";
    }
}

export class Plus extends Symbol2 {
    static is(character: string) {
        return character == "+";
    }
}

export class RightParenthesis extends Symbol2 {
    static is(character: string) {
        return character === ")";
    }
}

export class Atomic extends Symbol2 {
}

export class RegularExpression {
    private symbols: Symbol2[];
    constructor(stream: string) {
        this.symbols = this.scan(stream);
    }

    scan(stream: string) {
        return stream.split('').reduce((symbols: Symbol2[], character: string, currentIndex) => {
           return [
               ...symbols,
           ...((() => {
                   switch (true) {
                       case KleeneStar.is(character):
                           return [new KleeneStar()];
                       case Plus.is(character):
                           return [new Plus()];
                       case Union.is(character):
                           return [new Union()];
                       case RightParenthesis.is(character):
                           return [new RightParenthesis(), new Concatenation()];
                       case LeftParenthesis.is(character):
                           return [new Concatenation(), new LeftParenthesis()];
                       default:
                           if (symbols[symbols.length-1] instanceof Atomic) {
                               return [new Concatenation(), new Atomic(character)];
                           }
                           return [new Atomic(character)];
                   }
               })())
           ];
        }, []);
    }

    symbolsToPostfix() {
    }

}