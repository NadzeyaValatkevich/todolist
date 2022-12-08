import {v1} from "uuid";
import {TodolistType} from "../api/todolists-api";

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
};
export type FilterValuesType = 'all' | 'completed' | 'active';

export type RemoveTodolistActionType = {
    type: 'REMOVE-TODOLIST',
    id: string
};
export type AddTodolistActionType = {
    type: 'ADD-TODOLIST',
    title: string,
    todolistId: string
};
export type ChangeTodolistTitleActionType = {
    type: 'CHANGE-TODOLIST-TITLE',
    todolistId: string,
    title: string
};
export type ChangeTodolistFilterActionType = {
    type: 'CHANGE-TODOLIST-FILTER',
    id: string,
    filter: FilterValuesType
};
type ActionsTodolistsType = RemoveTodolistActionType | AddTodolistActionType | ChangeTodolistTitleActionType | ChangeTodolistFilterActionType

const initialState: TodolistDomainType[] = [];

export const todolistsReducer = (state: TodolistDomainType[] = initialState, action: ActionsTodolistsType): TodolistDomainType[] => {
    switch(action.type) {
        case 'REMOVE-TODOLIST': {
            return state.filter(elem => elem.id !== action.id)
        }
        case 'ADD-TODOLIST': {
            return [{
                id: action.todolistId,
                title:action.title,
                filter:'all',
                addedDate: '',
                order: 0
            }, ...state]
        }
        case 'CHANGE-TODOLIST-TITLE': {
            return state.map(elem => elem.id === action.todolistId ? {...elem, title: action.title} : elem)
        }
        case 'CHANGE-TODOLIST-FILTER': {
            return state.map(elem => elem.id === action.id ? {...elem, filter: action.filter} : elem)
        }
        default:
            return state
    }
};

export const removeTodolistAC = (todolistId: string): RemoveTodolistActionType => {
    return {
        type: 'REMOVE-TODOLIST',
        id: todolistId
    }
};
export const addTodolistAC = (title: string): AddTodolistActionType => {
    return {
        type: 'ADD-TODOLIST',
        title,
        todolistId: v1()
    }
};
export const changeTodolistTitleAC = (todolistId:string, title: string): ChangeTodolistTitleActionType => {
    return {
        type: 'CHANGE-TODOLIST-TITLE',
        todolistId,
        title
    }
};
export const changeTodolistFilterAC = (id:string, filter: FilterValuesType): ChangeTodolistFilterActionType => {
    return {
        type: 'CHANGE-TODOLIST-FILTER',
        id,
        filter
    }
};

