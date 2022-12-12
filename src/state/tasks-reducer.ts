import {TasksStateType} from "../AppWithRedux";
import {
    AddTodoListActionType,
    RemoveTodoListActionType,
    SetTodoListsActionType
} from "./todolists-reducer";
import {TaskType, todoListsApi, UpdateTaskModelType} from "../api/todolists-api";
import {AppRootStateType, AppThunk} from "./store";

export type RemoveTaskActionType = {
    type: 'REMOVE-TASK',
    taskId: string,
    todoListId: string
};
export type AddTaskActionType = {
    type: 'ADD-TASK',
    task: TaskType
};
export type UpdateTaskActionType = {
    type: 'UPDATE-TASK',
    taskId: string,
    todoListId: string,
    model: UpdateDomainTaskModelType
};
// export type ChangeTaskTitleActionType = {
//     type: 'CHANGE-TASK-TITLE',
//     taskId: string,
//     todoListId: string,
//     title: string
// };

export type SetTasksActionType = {
    type: 'SET-TASKS'
    tasks: TaskType[]
    todoListId: string
};

export type TasksActionsType = RemoveTaskActionType
    | AddTaskActionType
    | UpdateTaskActionType
    // | ChangeTaskTitleActionType
    | AddTodoListActionType
    | RemoveTodoListActionType
    | SetTodoListsActionType
    | SetTasksActionType

const initialState: TasksStateType = {};

export const tasksReducer = (state: TasksStateType = initialState, action: TasksActionsType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK': {
            return {...state, [action.todoListId]: state[action.todoListId].filter(t => t.id !== action.taskId)}
        }
        case 'ADD-TASK': {
            debugger
            return {...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]}
        }
        case 'UPDATE-TASK': {
            return {
                ...state,
                [action.todoListId]: state[action.todoListId].map(t => t.id === action.taskId ? {
                    ...t,
                    ...action.model
                } : t)
            }
        }
        // case 'CHANGE-TASK-TITLE': {
        //     return {
        //         ...state,
        //         [action.todoListId]: state[action.todoListId].map(t => t.id === action.taskId ? {
        //             ...t,
        //             title: action.title
        //         } : t)
        //     }
        // }
        case 'ADD-TODOLIST': {
            return {
                [action.todoList.id]: [], ...state
            }
        }
        case 'REMOVE-TODOLIST': {
            const stateCopy = {...state}
            delete stateCopy[action.id]
            return stateCopy
        }
        case 'SET-TODOLISTS': {
            const copyState = {...state}
            action.todoLists.forEach(tl => {
                copyState[tl.id] = [];
            });
            return copyState;
        }
        case 'SET-TASKS': {
            const copyState = {...state}
            copyState[action.todoListId] = action.tasks
            return copyState
        }
        default:
            return state
    }
};

export const removeTaskAC = (taskId: string, todoListId: string): RemoveTaskActionType => {
    return {
        type: 'REMOVE-TASK',
        taskId,
        todoListId
    }
};
export const addTaskAC = (task:TaskType): AddTaskActionType => {
    return {
        type: 'ADD-TASK',
        task
    }
};
export const updateTaskAC = (taskId: string, todoListId: string, model: UpdateDomainTaskModelType): UpdateTaskActionType => {
    return {
        type: 'UPDATE-TASK',
        taskId,
        todoListId,
        model
    }
};
// export const changeTaskTitleAC = (taskId: string, todoListId: string, title: string): ChangeTaskTitleActionType => {
//     return {
//         type: 'CHANGE-TASK-TITLE',
//         taskId,
//         todoListId,
//         title
//     }
// };
export const setTasksAC = (todoListId: string, tasks: TaskType[]): SetTasksActionType => {
    return {
        type:'SET-TASKS',
        todoListId,
        tasks
    }
};

export const fetchTasksTC = (todoListId: string): AppThunk => {
    return (dispatch) => {
        todoListsApi.getTasks(todoListId)
            .then(res => {
                dispatch(setTasksAC(todoListId, res.data.items))
            })
    }
};

export const removeTaskTC = (todoListId: string, taskId: string): AppThunk => {
    return (dispatch) => {
        todoListsApi.deleteTask(todoListId, taskId)
            .then (res => {
                dispatch(removeTaskAC(taskId, todoListId))
            })
    }
};
export const addTaskTC = (todoListId: string, title: string): AppThunk => {
    return (dispatch) => {
        todoListsApi.createTask(todoListId, title)
            .then(res => {
                dispatch(addTaskAC(res.data.data.item))
            })
    }
};

export type UpdateDomainTaskModelType = {
    title?: string,
    description?: string | null,
    status?: number,
    priority?: number,
    startDate?: string | null,
    deadline?: string | null
}
export const updateTaskTC = (todoListId: string, taskId: string, domainModal:UpdateDomainTaskModelType): AppThunk => {
    return (dispatch, getState: () => AppRootStateType) => {
        const state = getState();
        const task = state.tasks[todoListId].find(t => t.id === taskId);
        if(!task) {
            console.warn('task not found in the state');
            return
        };
        const appModel:UpdateTaskModelType  = {
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.startDate,
            ...domainModal
        }
        todoListsApi.updateTask(todoListId, taskId, appModel)
            .then(res => {
                dispatch(updateTaskAC(taskId, todoListId, domainModal))
            })
    }
};