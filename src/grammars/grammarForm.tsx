import {Button, required, SimpleForm} from "react-admin";
import * as React from "react";
import {MathInput} from "../@core/application/math";
import {Grammar, useTransducerAutomaton} from "./domain/Grammar";
import {transformGrammarUpsert} from "./grammarUpsert";
import {useFormState} from 'react-final-form';
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import Grid from "@material-ui/core/Grid";
import {MathFieldComponent} from "../@core/application/math/mathFieldComponent";
import {ProductionRule} from "./domain/ProductionRule";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const ProductionRulesList = (props: { production_rules: ProductionRule[], onClick?: (production_rule_index: number) => void }) => {
    return (<MenuList dense>
        {props.production_rules.map((rule, index) => (<MenuItem key={rule.showAsChomskyForm()}
                                                                onClick={() => props.onClick ? props.onClick(index) : null}>
            <ListItemText inset>
                <MathFieldComponent readOnly value={rule.showAsChomskyForm()}/>
            </ListItemText>
        </MenuItem>))}
    </MenuList>);
}


const GrammarDerivationFromUserInput = () => {
    const {values} = useFormState();
    const grammar = Grammar.parse(transformGrammarUpsert({id: values["id"] ?? "", grammar: values["grammar"]}));
    const {state, applyRule, reset} = useTransducerAutomaton(grammar.production_rules, grammar.start_symbol);

    const resetAll = () => {
        reset();
    }

    return (<Grid container spacing={2}>
        <Grid item xs={3} md={3}>
            <p>Type {grammar.type}</p>
            <ProductionRulesList production_rules={grammar.production_rules} onClick={applyRule}/>
        </Grid>
        <Grid item>
            <TableContainer component={Paper}>
                <Table aria-label="Grammar Derivation">
                    <TableHead>
                        <TableRow>
                            <TableCell>Rule</TableCell>
                            <TableCell align="right">Application</TableCell>
                            <TableCell align="right">Result</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {state.history.map((row, index) => (<TableRow key={`${row.byRule}${index}`}>
                            <TableCell component="th" scope="row">
                                <MathFieldComponent readOnly
                                                    value={row.byRule >= 0 ? grammar.production_rules[row.byRule].showAsChomskyForm() : `Start \\to ${grammar.start_symbol}`}/>
                            </TableCell>
                            <TableCell align="right">
                                <MathFieldComponent readOnly value={row.from}/>
                            </TableCell>
                            <TableCell align="right">
                                <MathFieldComponent readOnly value={row.to}/>
                            </TableCell>
                        </TableRow>))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Button label="Reset" onClick={resetAll}/>
        </Grid>
        <Grid item>
            <MathFieldComponent readOnly value={`L(G)=\\{${Array.from(state.language).join(",")}\\}`}/>
        </Grid>
    </Grid>);
};

// https://cortexjs.io/mathlive/demo/
const initialValue = "\\begin{equation*} G=\\left\\lbrace terminal:\\left\\lbrace a\\right\\rbrace,nonterminal:\\left\\lbrace\\Sigma,S\\right\\rbrace,start\\_symbol:\\Sigma,production\\_rules:\\left\\lbrace\\Sigma\\to S,S\\to\\lambda,S\\to a\\rbrace\\right\\rbrace\\right \\end{equation*}";
export const GrammarForm = (props: any) => (<SimpleForm warnWhenUnsavedChanges {...props}>
    <MathInput source="grammar" initialValue={initialValue} label="Grammar"
               validate={required("A grammar is required")}/>
    <GrammarDerivationFromUserInput/>
</SimpleForm>)