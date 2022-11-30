import {combineReducers} from "redux";
import {todolistsReducer} from "./todolists-reducer";
import {tasksReducer} from "./tasks-reducer";
import { legacy_createStore as createStore} from 'redux'

const rootReducer = combineReducers({
    todolists: todolistsReducer,
    tasks: tasksReducer
});

export type AppRootState = ReturnType<typeof rootReducer>

export const store = createStore(rootReducer);

//@ts-ignore
window.store = store