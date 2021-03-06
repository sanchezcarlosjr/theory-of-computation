import {FormDataConsumer, SimpleForm, TextInput,} from "react-admin";
import * as React from "react";
import {Grammar} from "./domain/Grammar";
import {useFormState} from 'react-final-form';
import Grid from "@material-ui/core/Grid";
import {ProductionRule} from "./domain/ProductionRule";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {NonTerminalSymbols} from "./domain/NonTerminalSymbols";
import {ParseTreeGraphviz} from "./ParseTreeGraphviz";


class GrammarCompiler {
    compile(name: string, str: string): Grammar {
        const grammar = JSON.parse(str);
        if (Array.isArray(grammar)) {
            throw new Error("Grammar may not be array");
        }
        return new Grammar(
            name,
            new Set(grammar.terminalSymbols),
            new NonTerminalSymbols(grammar.startSymbol, ...grammar.nonTerminalSymbols),
            grammar.productionRules.map((rule: { from: string, to: string }) => new ProductionRule(rule)),
            grammar.startSymbol
        )
    }
}

const GrammarDerivationFromUserInput = () => {
    const {values} = useFormState();
    try {
        const grammar = new GrammarCompiler().compile(values.name, values.grammar);
        const parsing = (str: string) => {
            const parseTree = grammar.parse(str);
            if (!parseTree.accepts) {
                return "The string can not be generated by the grammar.";
            }
            return undefined;
        }

        return (<Grid container spacing={2}>
            <Grid item xs={12} md={12}>
                <p>Type {grammar.nameType}</p>
            </Grid>
            <Grid item xs={12} md={12}>
                <h2>Backus–Naur form</h2>
                {
                    grammar.production_rules.map((rule, index) => {
                        return <p key={rule.backusFormLeftSide.join("")+index}>{rule.backusFormLeftSide.join("")} ::= {rule.backusFormRightSide.join("")}</p>
                    })
                }
            </Grid>
            {
                grammar.type >= 2 &&
                <>
                    <Grid item xs={12} md={12}>
                        <h2>Test</h2>
                        <TextInput source="str" label={"String"} multiline={true} fullWidth validate={[parsing]}/>
                    </Grid>
                    <FormDataConsumer>
                        {({formData, ...rest}) => {
                            const parse = grammar.parse(formData.str ?? "");
                            return parse.accepts && <>
                                <Grid item xs={12} md={12}>
                                    <h2>Parse tree</h2>
                                    <ParseTreeGraphviz tree={parse.buildParseTree()}/>
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <h2>Execution</h2>
                                    <TableContainer component={Paper}>
                                        <Table aria-label="Execution">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Stack</TableCell>
                                                    <TableCell>Input</TableCell>
                                                    <TableCell>Action</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {parse.configurations.map((row, index) => (<TableRow key={`${index}${row.stack}`}>
                                                    <TableCell component="th" scope="row">
                                                        {row.stack.join("")}
                                                    </TableCell>
                                                    <TableCell component="th" scope="row">
                                                        {row.input.join("")}
                                                    </TableCell>
                                                    <TableCell component="th" scope="row">
                                                        {
                                                            row.action.type === "shift" && "Shift"
                                                        }
                                                        {
                                                            row.action.type === "reduce" &&
                                                            <>
                                                                Reduce by {
                                                                grammar.production_rules[row.action.by ?? 0].fromString
                                                            } ⇛ {
                                                                grammar.production_rules[row.action.by ?? 0].applicationString
                                                                // @ts-ignore
                                                            } (Rule {(row.action?.by ?? 0) + 1})
                                                            </>
                                                        }
                                                        {
                                                            row.action.type === 'backtracking' && 'Backtrack'
                                                        }
                                                        {
                                                            row.action.type === "accept" && "Accept"
                                                        }
                                                    </TableCell>
                                                </TableRow>))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                            </>
                        }
                        }
                    </FormDataConsumer>

                </>
            }
        </Grid>);
    } catch (e) {
        // @ts-ignore
        return <p>{e?.message}</p>;
    }
};


// https://cortexjs.io/mathlive/demo/
export const GrammarForm = (props: any) => (<SimpleForm warnWhenUnsavedChanges {...props}>
    <TextInput
        source="name"
        label="Name"
        fullWidth
    />
    <TextInput
        defaultValue={`{
    "terminalSymbols": ["x", "+", "(", ")"],
    "nonTerminalSymbols": ["T", "F", "E"],
    "startSymbol": "E",
    "productionRules": [
               {
                 "from": "E",
                 "to": "x+x"
                }
     ]
}`}
        source="grammar"
        multiline
        label="Grammar"
        fullWidth
    />
    <GrammarDerivationFromUserInput/>
</SimpleForm>)