import {applyMiddleware, combineReducers} from "redux";
import {TodolistsActionsType, todolistsReducer} from "./todolists-reducer";
import {TasksActionsType, tasksReducer} from "./tasks-reducer";
import {legacy_createStore as createStore} from 'redux'
import thunk, {ThunkAction} from "redux-thunk";

const rootReducer = combineReducers({
    todolists: todolistsReducer,
    tasks: tasksReducer
});

export type AppRootStateType = ReturnType<typeof rootReducer>;
export type AppActionsType = TodolistsActionsType | TasksActionsType;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    AppRootStateType,
    unknown,
    AppActionsType>

export const store = createStore(rootReducer, applyMiddleware(thunk));

//@ts-ignore
window.store = store