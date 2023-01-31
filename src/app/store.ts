import {combineReducers} from "redux";
import {tasksReducer, todoListsReducer} from "../features/TodolistsList";
import thunkMiddleware, {ThunkAction} from "redux-thunk";
import {authReducer} from "../features/Auth";
import {configureStore} from "@reduxjs/toolkit";
import {appReducer} from "../features/Application";
import {AppRootStateType} from "../utils/types";

export const rootReducer = combineReducers({
    todoLists: todoListsReducer,
    tasks: tasksReducer,
    app: appReducer,
    auth: authReducer
});
// export type AppActionsType = TodoListsActionsType | TasksActionsType | ActionsType;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    AppRootStateType,
    unknown,
    // AppActionsType
    any
    >

// export const store = createStore(rootReducer, applyMiddleware(thunk));
export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunkMiddleware)
});

//@ts-ignore
window.store = store;