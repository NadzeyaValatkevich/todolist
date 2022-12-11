import {TasksStateType} from "../AppWithRedux";
import {v1} from "uuid";
import {
    AddTodolistActionType,
    RemoveTodolistActionType,
    setTodolistsAC,
    SetTodolistsActionType
} from "./todolists-reducer";
import {TaskPriorities, TaskStatuses, TaskType, todolistsApi} from "../api/todolists-api";
import {Dispatch} from "redux";
import {AppActionsType, AppThunk} from "./store";

export type RemoveTaskActionType = {
    type: 'REMOVE-TASK',
    taskId: string,
    todolistId: string
};
export type AddTaskActionType = {
    type: 'ADD-TASK',
    todolistId: string,
    title: string
};
export type ChangeTaskStatusActionType = {
    type: 'CHANGE-TASK-STATUS',
    taskId: string,
    todolistId: string,
    status: TaskStatuses
};
export type ChangeTaskTitleActionType = {
    type: 'CHANGE-TASK-TITLE',
    taskId: string,
    todolistId: string,
    title: string
};

export type SetTasksActionType = {
    type: 'SET-TASKS'
    tasks: TaskType[]
    todolistId: string
};

export type TasksActionsType = RemoveTaskActionType
    | AddTaskActionType
    | ChangeTaskStatusActionType
    | ChangeTaskTitleActionType
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistsActionType
    | SetTasksActionType

const initialState: TasksStateType = {};

export const tasksReducer = (state: TasksStateType = initialState, action: TasksActionsType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK': {
            return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)}
        }
        case 'ADD-TASK': {
            const newTask = {
                id: v1(), title: action.title, status: TaskStatuses.New,
                todolistId: action.todolistId, description: "", startDate: "", deadline: "", addedDate: "", order: 0,
                priority: TaskPriorities.Low
            };
            return {...state, [action.todolistId]: [newTask, ...state[action.todolistId]]}
        }
        case 'CHANGE-TASK-STATUS': {
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskId ? {
                    ...t,
                    status: action.status
                } : t)
            }
        }
        case 'CHANGE-TASK-TITLE': {
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskId ? {
                    ...t,
                    title: action.title
                } : t)
            }
        }
        case 'ADD-TODOLIST': {
            return {
                [action.todolistId]: [], ...state
            }
        }
        case 'REMOVE-TODOLIST': {
            const stateCopy = {...state}
            delete stateCopy[action.id]
            return stateCopy
        }
        case 'SET-TODOLISTS': {
            const copyState = {...state}
            action.todolists.forEach(tl => {
                copyState[tl.id] = [];
            });
            return copyState;
        }
        case 'SET-TASKS': {
            const copyState = {...state}
            copyState[action.todolistId] = action.tasks
            return copyState
        }
        default:
            return state
    }
};

export const removeTaskAC = (taskId: string, todolistId: string): RemoveTaskActionType => {
    return {
        type: 'REMOVE-TASK',
        taskId,
        todolistId
    }
};
export const addTaskAC = (title: string, todolistId: string): AddTaskActionType => {
    return {
        type: 'ADD-TASK',
        title,
        todolistId,
    }
};
export const changeTaskStatusAC = (taskId: string, todolistId: string, status: TaskStatuses): ChangeTaskStatusActionType => {
    return {
        type: 'CHANGE-TASK-STATUS',
        taskId,
        todolistId,
        status
    }
};
export const changeTaskTitleAC = (taskId: string, todolistId: string, title: string): ChangeTaskTitleActionType => {
    return {
        type: 'CHANGE-TASK-TITLE',
        taskId,
        todolistId,
        title
    }
};
export const setTasksAC = (todolistId: string, tasks: TaskType[]): SetTasksActionType => {
    return {
        type:'SET-TASKS',
        todolistId,
        tasks
    }
};

export const fetchTasksTC = (todolistId: string): AppThunk => {
    return (dispatch) => {
        todolistsApi.getTasks(todolistId)
            .then(res => {
                dispatch(setTasksAC(todolistId, res.data.items))
            })
    }
};