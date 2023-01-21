import * as tasksActions from './tasks-actions';
import * as todoListsAsyncActions from './todoLists-actions';
import {slice} from './todoLists-reducer';

const todoListsActions = {
    ...todoListsAsyncActions,
    ...slice.actions
}

export {
    tasksActions,
    todoListsActions
};
