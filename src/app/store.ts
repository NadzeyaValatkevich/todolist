import {ActionCreatorsMapObject, bindActionCreators, combineReducers} from "redux";
import {todoListsReducer} from "../features/TodolistsList/todoLists-reducer";
import {tasksReducer} from "../features/TodolistsList/tasks-reducer";
import thunkMiddleware, {ThunkAction} from "redux-thunk";
import {appReducer} from "./app-reducer";
import {authReducer} from "../features/Auth/auth-reducer";
import {configureStore} from "@reduxjs/toolkit";
import {useDispatch} from "react-redux";
import {useMemo} from "react";

const rootReducer = combineReducers({
    todoLists: todoListsReducer,
    tasks: tasksReducer,
    app: appReducer,
    auth: authReducer
});

export type RootReducerType = typeof rootReducer;

export type AppRootStateType = ReturnType<typeof rootReducer>;
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

export type AppDispatchType = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatchType>();

export function useActions<T extends ActionCreatorsMapObject>(actions: T) {
    const dispatch = useAppDispatch();

    const boundActions = useMemo(() => {
        return bindActionCreators(actions, dispatch)
    }, [])
    return boundActions
};

