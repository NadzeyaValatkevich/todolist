import {asyncActions as tasksAsyncActions} from './tasks-reducer';
import {asyncActions as todoListsAsyncActions} from './todoLists-reducer';
import {TodoListsList} from './TodolistsList';
import {slice as todoListsSlice} from './todoLists-reducer';
import {slice as tasksSlice} from './tasks-reducer';

const todoListsActions = {
    ...todoListsAsyncActions,
    ...todoListsSlice.actions
};

const tasksActions = {
    ...tasksAsyncActions,
};

const todoListsReducer = todoListsSlice.reducer;
const tasksReducer = tasksSlice.reducer;

export {
    tasksActions,
    todoListsActions,
    TodoListsList,
    todoListsReducer,
    tasksReducer
};


