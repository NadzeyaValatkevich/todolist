import {applyMiddleware, combineReducers} from "redux";
import {TodoListsActionsType, todoListsReducer} from "./todolists-reducer";
import {TasksActionsType, tasksReducer} from "./tasks-reducer";
import {legacy_createStore as createStore} from 'redux'
import thunk, {ThunkAction} from "redux-thunk";

const rootReducer = combineReducers({
    todoLists: todoListsReducer,
    tasks: tasksReducer
});

export type AppRootStateType = ReturnType<typeof rootReducer>;
export type AppActionsType = TodoListsActionsType | TasksActionsType;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    AppRootStateType,
    unknown,
    AppActionsType>

export const store = createStore(rootReducer, applyMiddleware(thunk));

//@ts-ignore
window.store = store