import {todoListsApi, TodoListType} from "../../api/todolists-api";
import {AppThunk} from "../../app/store";

const initialState: TodoListDomainType[] = [];

export const todoListsReducer = (state: TodoListDomainType[] = initialState, action: TodoListsActionsType): TodoListDomainType[] => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST':
            return [{...action.todoList, filter: 'all'}, ...state]
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.todoListId ? {...tl, title: action.title} : tl)
        case 'CHANGE-TODOLIST-FILTER': {
            return state.map(tl => tl.id === action.todoListId ? {...tl, filter: action.filter} : tl)
        }
        case 'SET-TODOLISTS':
            return action.todoLists.map(tl => ({...tl, filter: 'all'}))
        default:
            return state
    }
};

// actions
export const removeTodoListAC = (todoListId: string) => ({type: 'REMOVE-TODOLIST', id: todoListId} as const);
export const addTodoListAC = (todoList: TodoListType) => ({type: 'ADD-TODOLIST', todoList} as const);
export const changeTodoListTitleAC = (todoListId: string, title: string) =>
    ({
        type: 'CHANGE-TODOLIST-TITLE',
        todoListId,
        title
    } as const);
export const changeTodoListFilterAC = (todoListId: string, filter: FilterValuesType) =>
    ({
        type: 'CHANGE-TODOLIST-FILTER',
        todoListId,
        filter

    } as const);
export const setTodoListsAC = (todoLists: TodoListType[]) => ({type: 'SET-TODOLISTS', todoLists} as const);


// thunks
export const fetchTodoListsTC = (): AppThunk => (dispatch) => {
    todoListsApi.getTodoLists()
        .then(res => {
            dispatch(setTodoListsAC(res.data))
        })
};

export const removeTodoListTC = (todoListId: string): AppThunk => (dispatch) => {
    todoListsApi.deleteTodoList(todoListId)
        .then(res => {
            dispatch(removeTodoListAC(todoListId))
        })
};

export const createTodoListTC = (title: string): AppThunk => (dispatch) => {
        todoListsApi.createTodoLists(title)
            .then(res => {
                dispatch(addTodoListAC(res.data.data.item))
            })
};

export const changeTodoListTitleTC = (title: string, todoListId: string): AppThunk => (dispatch) => {
        todoListsApi.updateTodoListTitle(todoListId, title)
            .then(res => {
                dispatch(changeTodoListTitleAC(todoListId, title))
            })
};

// types
export type TodoListDomainType = TodoListType & {
    filter: FilterValuesType
};
export type FilterValuesType = 'all' | 'completed' | 'active';

export type RemoveTodoListActionType = ReturnType<typeof removeTodoListAC>;
export type AddTodoListActionType = ReturnType<typeof addTodoListAC>;
export type ChangeTodoListTitleActionType = ReturnType<typeof changeTodoListTitleAC>;
export type ChangeTodoListFilterActionType = ReturnType<typeof changeTodoListFilterAC>;
export type SetTodoListsActionType = ReturnType<typeof setTodoListsAC>;

export type TodoListsActionsType = RemoveTodoListActionType
    | AddTodoListActionType
    | ChangeTodoListTitleActionType
    | ChangeTodoListFilterActionType
    | SetTodoListsActionType;