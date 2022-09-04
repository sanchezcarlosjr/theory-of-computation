import {
    Atomic,
    Concatenation,
    KleeneStar,
    LeftParenthesis,
    Plus,
    RegularExpression,
    RightParenthesis,
    Union
} from "./RegularExpression";


describe('regex', () => {
    it.only('should scan', () => {
        const stream = "abc|1";
        const regex = new RegularExpression(stream);
        expect(regex.scan(stream)).toEqual([
            new Atomic('a'),
            new Concatenation(),
            new Atomic('b'),
            new Concatenation(),
            new Atomic('c'),
            new Union(),
            new Atomic('1')
        ]);
    });
    it.only('should scan 2', () => {
        const stream = "a(bb)+1*|xba";
        const regex = new RegularExpression(stream);
        expect(regex.scan(stream)).toEqual([
            new Atomic('a'),
            new Concatenation(),
            new LeftParenthesis(),
            new Atomic('b'),
            new Concatenation(),
            new Atomic('b'),
            new RightParenthesis(),
            new Concatenation(),
            new Plus(),
            new Atomic('1'),
            new KleeneStar(),
            new Union(),
            new Atomic('x'),
            new Concatenation(),
            new Atomic('b'),
            new Concatenation(),
            new Atomic('a'),
        ]);
    });
});