import {Provider} from "react-redux";
import {AppRootStateType} from "../state/store";
import {combineReducers, legacy_createStore as createStore} from "redux";
import {todolistsReducer} from "../state/todolists-reducer";
import {tasksReducer} from "../state/tasks-reducer";
import {v1} from "uuid";
import {TaskPriorities, TaskStatuses} from "../api/todolists-api";

const rootReducer = combineReducers({
    todolists: todolistsReducer,
    tasks: tasksReducer
});

const initialGlobalState = {
    todolists: [
        {id: 'todolistId1', title: 'What to learn', filter: 'all', addedDate: "", order: 0},
        {id: 'todolistId2', title: 'What to buy', filter: 'all', addedDate: "", order: 1},
    ],
    tasks: {
        ['todolistId1']: [
            {id: v1(), title: 'HTML&CSS', todolistId: 'todolistId1', status: TaskStatuses.Completed,
                description: "", priority: TaskPriorities.Low, startDate: "", deadline: "", order: 0, addedDate: ""},
            {id: v1(), title: 'JS', todolistId: 'todolistId1', status: TaskStatuses.Completed,
                description: "", priority: TaskPriorities.Low, startDate: "", deadline: "", order: 1, addedDate: ""},
        ],
        ['todolistId2']: [
            {id: v1(), title: 'Milk', todolistId: 'todolistId2', status: TaskStatuses.Completed,
                description: "", priority: TaskPriorities.Low, startDate: "", deadline: "", order: 0, addedDate: ""},
            {id: v1(), title: 'Bread', todolistId: 'todolistId2', status: TaskStatuses.New,
                description: "", priority: TaskPriorities.Low, startDate: "", deadline: "", order: 1, addedDate: ""},
        ]
    }
};

export const storyBookStore = createStore(rootReducer, initialGlobalState as AppRootStateType)

export const reduxStoreProviderDecorator = (storyFn: any) => {
    return <Provider store={storyBookStore}> {storyFn()} </Provider>
}