import {todoListsApi, TodoListType} from "../api/todolists-api";
import {AppThunk} from "./store";

export type TodoListDomainType = TodoListType & {
    filter: FilterValuesType
};
export type FilterValuesType = 'all' | 'completed' | 'active';

export type RemoveTodoListActionType = {
    type: 'REMOVE-TODOLIST',
    id: string
};
export type AddTodoListActionType = {
    type: 'ADD-TODOLIST',
    todoList: TodoListType
};
export type ChangeTodoListTitleActionType = {
    type: 'CHANGE-TODOLIST-TITLE',
    todoListId: string,
    title: string
};
export type ChangeTodoListFilterActionType = {
    type: 'CHANGE-TODOLIST-FILTER',
    id: string,
    filter: FilterValuesType
};
export type SetTodoListsActionType = {
    type: 'SET-TODOLISTS',
    todoLists: TodoListType[]
};

export type TodoListsActionsType = RemoveTodoListActionType
    | AddTodoListActionType
    | ChangeTodoListTitleActionType
    | ChangeTodoListFilterActionType
    | SetTodoListsActionType

const initialState: TodoListDomainType[] = [];

export const todoListsReducer = (state: TodoListDomainType[] = initialState, action: TodoListsActionsType): TodoListDomainType[] => {
    switch (action.type) {
        case 'REMOVE-TODOLIST': {
            return state.filter(tl => tl.id !== action.id)
        }
        case 'ADD-TODOLIST': {
            return [{...action.todoList, filter:'all'}, ...state]
        }
        case 'CHANGE-TODOLIST-TITLE': {
            return state.map(elem => elem.id === action.todoListId ? {...elem, title: action.title} : elem)
        }
        case 'CHANGE-TODOLIST-FILTER': {
            return state.map(elem => elem.id === action.id ? {...elem, filter: action.filter} : elem)
        }
        case 'SET-TODOLISTS': {
            return action.todoLists.map(tl => {
                return {
                    ...tl,
                    filter: 'all'
                }
            })
        }
        default:
            return state
    }
};

export const removeTodoListAC = (todoListId: string): RemoveTodoListActionType => {
    return {
        type: 'REMOVE-TODOLIST',
        id: todoListId
    }
};
export const addTodoListAC = (todoList: TodoListType): AddTodoListActionType => {
    return {
        type: 'ADD-TODOLIST',
        todoList
    }
};
export const changeTodoListTitleAC = (todoListId: string, title: string): ChangeTodoListTitleActionType => {
    return {
        type: 'CHANGE-TODOLIST-TITLE',
        todoListId,
        title
    }
};
export const changeTodoListFilterAC = (id: string, filter: FilterValuesType): ChangeTodoListFilterActionType => {
    return {
        type: 'CHANGE-TODOLIST-FILTER',
        id,
        filter
    }
};
export const setTodoListsAC = (todoLists: TodoListType[]): SetTodoListsActionType => {
    return {
        type: 'SET-TODOLISTS',
        todoLists
    }
};

export const fetchTodoListsTC = ():AppThunk => {
    return (dispatch) => {
        todoListsApi.getTodoLists()
            .then(res => {
                dispatch(setTodoListsAC(res.data))
            })
    }
};
export const removeTodoListTC = (todoListId: string): AppThunk => {
    return (dispatch) => {
        todoListsApi.deleteTodoList(todoListId)
            .then(res => {
                dispatch(removeTodoListAC(todoListId))
            })
    }
};
export const createTodoListTC = (title: string): AppThunk => {
    return (dispatch) => {
        todoListsApi.createTodoLists(title)
            .then(res => {
                dispatch(addTodoListAC(res.data.data.item))
            })
    }
};
export const changeTodoListTitleTC = (title: string, todoListId: string): AppThunk => {
    return (dispatch) => {
        todoListsApi.updateTodoListTitle(todoListId, title)
            .then(res => {
                dispatch(changeTodoListTitleAC(todoListId, title))
            })
    }
};