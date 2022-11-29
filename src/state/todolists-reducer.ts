import {FilterValuesType, TodolistType} from "../App";
import {v1} from "uuid";

export type RemoveTodolistActionType = {
    type: 'REMOVE-TODOLIST',
    id: string
}
export type AddTodolistActionType = {
    type: 'ADD-TODOLIST',
    title: string,
    todolistId: string
}
type ChangeTodolistTitleActionType = {
    type: 'CHANGE-TODOLIST-TITLE',
    id: string,
    title: string
}
export type ChangeTodolistFilterActionType = {
    type: 'CHANGE-TODOLIST-FILTER',
    id: string,
    filter: FilterValuesType
}
type ActionsType = RemoveTodolistActionType | AddTodolistActionType | ChangeTodolistTitleActionType | ChangeTodolistFilterActionType

export const todolistsReducer = (state: TodolistType[], action: ActionsType): TodolistType[] => {
    switch(action.type) {
        case 'REMOVE-TODOLIST': {
            return state.filter(elem => elem.id !== action.id)
        }
        case 'ADD-TODOLIST': {
            return [{id: action.todolistId, title:action.title, filter:'all'}, ...state]
        }
        case 'CHANGE-TODOLIST-TITLE': {
            return state.map(elem => elem.id === action.id ? {...elem, title: action.title} : elem)
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
export const changeTodolistTitleAC = (id:string, title: string): ChangeTodolistTitleActionType => {
    return {
        type: 'CHANGE-TODOLIST-TITLE',
        id,
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

