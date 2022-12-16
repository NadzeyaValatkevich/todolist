import {applyMiddleware, combineReducers} from "redux";
import {TodoListsActionsType, todoListsReducer} from "../features/TodolistsList/todolists-reducer";
import {TasksActionsType, tasksReducer} from "../features/TodolistsList/tasks-reducer";
import {legacy_createStore as createStore} from 'redux'
import thunk, {ThunkAction} from "redux-thunk";
import {ActionsType, appReducer} from "./app-reducer";

const rootReducer = combineReducers({
    todoLists: todoListsReducer,
    tasks: tasksReducer,
    app: appReducer
});

export type AppRootStateType = ReturnType<typeof rootReducer>;
export type AppActionsType = TodoListsActionsType | TasksActionsType | ActionsType;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    AppRootStateType,
    unknown,
    AppActionsType>

export const store = createStore(rootReducer, applyMiddleware(thunk));

//@ts-ignore
window.store = store