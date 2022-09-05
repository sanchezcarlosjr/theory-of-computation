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
    it('should scan', () => {
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
    it('should scan 3', () => {
        const stream = "\\*abc";
        const regex = new RegularExpression(stream);
        expect(regex.scan(stream)).toEqual([
            new Atomic('*'),
            new Concatenation(),
            new Atomic('a'),
            new Concatenation(),
            new Atomic('b'),
            new Concatenation(),
            new Atomic('c'),
        ]);
    });
    it('should scan 2', () => {
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
    it('should parse', () => {
        const regex = new RegularExpression("a(bb)+a");
        regex.compile();
        expect(regex.symbols).toEqual([
            new Atomic('a'),
            new Atomic('b'),
            new Atomic('b'),
            new Concatenation(),
            new Plus(),
            new Concatenation(),
            new Atomic('a'),
            new Concatenation()
        ]);
    });
    it('should parse 2', () => {
        const regex = new RegularExpression("a(bb)+a");
        regex.compile();
        expect(regex.symbols).toEqual([
            new Atomic('a'),
            new Atomic('b'),
            new Atomic('b'),
            new Concatenation(),
            new Plus(),
            new Concatenation(),
            new Atomic('a'),
            new Concatenation()
        ]);
    });
    it('should generate a nfa 2', () => {
        const regex = new RegularExpression("(ab)+");
        const nfa  = regex.compile();
        console.log(nfa);
    });
    it('should generate a nfa', () => {
        const regex = new RegularExpression("a+");
        const nfa  = regex.compile();
        console.log(nfa);

    });
    it.only('should generate nfa 3', () => {
        const regex = new RegularExpression("(a|b)*|(c|d)*");
        const nfa  = regex.compile();
        console.log(nfa);
    });
});