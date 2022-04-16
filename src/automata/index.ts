import {AutomataCreate, AutomataEdit} from "./automataUpsert";
import {AutomataList} from "./automataList";

const module = {
    options: {label: 'Automata'},
    create: AutomataCreate,
    list: AutomataList,
    edit: AutomataEdit
};

export default module;