import {TasksStateType} from "../App";
import {v1} from "uuid";
import {AddTodolistActionType, RemoveTodolistActionType} from "./todolists-reducer";

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
    isDone: boolean
};
export type ChangeTaskTitleActionType = {
    type: 'CHANGE-TASK-TITLE',
    taskId: string,
    todolistId: string,
    title: string
};
type ActionsType = RemoveTaskActionType
    | AddTaskActionType
    | ChangeTaskStatusActionType
    | ChangeTaskTitleActionType
    | AddTodolistActionType
    | RemoveTodolistActionType

export const tasksReducer = (state: TasksStateType, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK': {
            return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)}
        }
        case 'ADD-TASK': {
            const newTask = {id: v1(), title: action.title, isDone: false};
            return {...state, [action.todolistId]: [newTask, ...state[action.todolistId]]}
        }
        case 'CHANGE-TASK-STATUS': {
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskId ? {
                    ...t,
                    isDone: action.isDone
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
        default: {
            return state
        }
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
export const changeTaskStatusAC = (taskId: string, todolistId: string, isDone: boolean): ChangeTaskStatusActionType => {
    return {
        type: 'CHANGE-TASK-STATUS',
        taskId,
        todolistId,
        isDone
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
