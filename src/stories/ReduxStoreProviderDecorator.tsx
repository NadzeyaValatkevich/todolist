import {Provider} from "react-redux";
import {AppRootStateType} from "../state/store";
import {combineReducers, legacy_createStore as createStore} from "redux";
import {todoListsReducer} from "../state/todolists-reducer";
import {tasksReducer} from "../state/tasks-reducer";
import {v1} from "uuid";
import {TaskPriorities, TaskStatuses} from "../api/todolists-api";

const rootReducer = combineReducers({
    todoLists: todoListsReducer,
    tasks: tasksReducer
});

const initialGlobalState = {
    todoLists: [
        {id: 'todoListId1', title: 'What to learn', filter: 'all', addedDate: "", order: 0},
        {id: 'todoListId2', title: 'What to buy', filter: 'all', addedDate: "", order: 1},
    ],
    tasks: {
        ['todoListId1']: [
            {id: v1(), title: 'HTML&CSS', todoListId: 'todoListId1', status: TaskStatuses.Completed,
                description: "", priority: TaskPriorities.Low, startDate: "", deadline: "", order: 0, addedDate: ""},
            {id: v1(), title: 'JS', todoListId: 'todoListId1', status: TaskStatuses.Completed,
                description: "", priority: TaskPriorities.Low, startDate: "", deadline: "", order: 1, addedDate: ""},
        ],
        ['todoListId2']: [
            {id: v1(), title: 'Milk', todoListId: 'todoListId2', status: TaskStatuses.Completed,
                description: "", priority: TaskPriorities.Low, startDate: "", deadline: "", order: 0, addedDate: ""},
            {id: v1(), title: 'Bread', todoListId: 'todoListId2', status: TaskStatuses.New,
                description: "", priority: TaskPriorities.Low, startDate: "", deadline: "", order: 1, addedDate: ""},
        ]
    }
};

export const storyBookStore = createStore(rootReducer, initialGlobalState as AppRootStateType)

export const reduxStoreProviderDecorator = (storyFn: any) => {
    return <Provider store={storyBookStore}> {storyFn()} </Provider>
}