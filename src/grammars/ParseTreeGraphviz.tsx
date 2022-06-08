import Graphviz from "graphviz-react";
import * as React from "react";
import {Tree} from "./domain/ParseTree";

export const ParseTreeGraphviz = ({tree}: { tree: Tree[] }) => {
    const graph = tree.map((tree) =>
             `${tree.id} [label="${tree.label}"]; ${tree.children !== undefined ? tree.children.map((child) => `${tree.id}--${child};`).join("") : ""}`
    ).join("");
    return <Graphviz dot={`
             graph
                {
                    fontname="Helvetica,Arial,sans-serif"
                   subgraph cluster38
                   {
                      ${graph}
                   }
                }
        `}/>;
}