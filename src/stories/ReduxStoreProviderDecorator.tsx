import {Provider} from "react-redux";
import {combineReducers} from "redux";
import {todoListsReducer} from "../features/TodolistsList";
import {tasksReducer} from "../features/TodolistsList";
import {v1} from "uuid";
import thunkMiddleware from "redux-thunk";
import {authReducer} from "../features/Auth";
import {configureStore} from "@reduxjs/toolkit";
import {HashRouter} from "react-router-dom";
import {AppRootStateType, RootReducerType} from "../utils/types";
import {appReducer} from "../features/Application";
import {TaskPriorities, TaskStatuses} from "../api/types";

const rootReducer: RootReducerType = combineReducers({
    todoLists: todoListsReducer,
    tasks: tasksReducer,
    app: appReducer,
    auth: authReducer
});

const initialGlobalState: AppRootStateType = {
    todoLists: [
        {id: 'todoListId1', title: 'What to learn', filter: 'all', entityStatus: 'idle', addedDate: "", order: 0},
        {id: 'todoListId2', title: 'What to buy', filter: 'all', entityStatus: 'loading', addedDate: "", order: 1},
    ],
    tasks: {
        ['todoListId1']: [
            {
                id: v1(), title: 'HTML&CSS', todoListId: 'todoListId1', status: TaskStatuses.Completed,
                description: "", priority: TaskPriorities.Low, startDate: "", deadline: "", order: 0, addedDate: ""
            },
            {
                id: v1(), title: 'JS', todoListId: 'todoListId1', status: TaskStatuses.Completed,
                description: "", priority: TaskPriorities.Low, startDate: "", deadline: "", order: 1, addedDate: ""
            },
        ],
        ['todoListId2']: [
            {
                id: v1(), title: 'Milk', todoListId: 'todoListId2', status: TaskStatuses.Completed,
                description: "", priority: TaskPriorities.Low, startDate: "", deadline: "", order: 0, addedDate: ""
            },
            {
                id: v1(), title: 'Bread', todoListId: 'todoListId2', status: TaskStatuses.New,
                description: "", priority: TaskPriorities.Low, startDate: "", deadline: "", order: 1, addedDate: ""
            },
        ]
    },
    app: {
        error: null,
        status: 'succeeded',
        isInitialized: true
    },
    auth: {
        isLoggedIn: true
    }
};

export const storyBookStore = configureStore({
    reducer: rootReducer,
    preloadedState: initialGlobalState,
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunkMiddleware)
});

export const reduxStoreProviderDecorator = (storyFn: any) => {
    return <Provider store={storyBookStore}> {storyFn()} </Provider>
};

export const BrowserRouterDecorator = (storyFn: any) => {
    <HashRouter>
        {storyFn()}
    </HashRouter>
}