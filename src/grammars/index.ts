import {GrammarList} from "./grammarList";
import {GrammarCreate, GrammarEdit} from "./grammarUpsert";

const module = {
    options: {label: 'Grammar'},
    list: GrammarList,
    create: GrammarCreate,
    edit: GrammarEdit
};

export default module;