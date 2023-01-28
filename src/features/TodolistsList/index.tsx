import {asyncActions as tasksAsyncActions} from './tasks-reducer';
import {asyncActions as todoListsAsyncActions, slice} from './todoLists-reducer';
import {TodoListsList} from './TodolistsList'

const todoListsActions = {
    ...todoListsAsyncActions,
    ...slice.actions
};

const tasksActions = {
    ...tasksAsyncActions,
};

export {
    tasksActions,
    todoListsActions,
    TodoListsList
};


