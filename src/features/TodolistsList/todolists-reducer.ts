import {todoListsApi, TodoListType} from "../../api/todolists-api";
import {AppThunk} from "../../app/store";
import {setStatusAC} from "../../app/app-reducer";
import {handleServerNetworkError} from "../../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: TodoListDomainType[] = [];

const slice = createSlice({
    name: 'todoLists',
    initialState: initialState,
    reducers: {
        removeTodoListAC(state, action: PayloadAction<{ todoListId: string }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todoListId);
            if(index > -1) {
                state.splice(index, 1)
            };
        },
        addTodoListAC(state, action: PayloadAction<{ todoList: TodoListType }>) {
            state.unshift({...action.payload.todoList, filter: 'all', entityStatus: 'idle'});
        },
        changeTodoListTitleAC(state, action: PayloadAction<{ todoListId: string, title: string }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todoListId);
            state[index].title = action.payload.title;
        },
        changeTodoListFilterAC(state, action: PayloadAction<{ todoListId: string, filter: FilterValuesType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todoListId);
            state[index].filter = action.payload.filter;
        },
        setTodoListsAC(state, action: PayloadAction<{ todoLists: TodoListType[] }>) {
            return action.payload.todoLists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        },
        changeTodoListEntityStatusAC(state, action: PayloadAction<{ todoListId: string, entityStatus: 'idle' | 'loading' | 'succeeded' | 'failed' }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todoListId);
            state[index].entityStatus = action.payload.entityStatus;
        }
    }
});

export const todoListsReducer = slice.reducer;
export const {
    removeTodoListAC,
    addTodoListAC,
    changeTodoListTitleAC,
    changeTodoListFilterAC,
    setTodoListsAC,
    changeTodoListEntityStatusAC
} = slice.actions;

// thunks
export const fetchTodoListsTC = (): AppThunk => (dispatch) => {
    dispatch(setStatusAC({status: 'loading'}))
    todoListsApi.getTodoLists()
        .then(res => {
            dispatch(setTodoListsAC({todoLists: res.data}))
            dispatch(setStatusAC({status: 'succeeded'}))
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
        })
};

export const removeTodoListTC = (todoListId: string): AppThunk => (dispatch) => {
    dispatch(setStatusAC({status: 'loading'}))
    dispatch(changeTodoListEntityStatusAC({todoListId, entityStatus: 'loading'}))
    todoListsApi.deleteTodoList(todoListId)
        .then(res => {
            dispatch(removeTodoListAC({todoListId}))
            dispatch(setStatusAC({status: 'succeeded'}))
        })
};

export const createTodoListTC = (title: string): AppThunk => (dispatch) => {
    dispatch(setStatusAC({status: 'loading'}))
    todoListsApi.createTodoLists(title)
        .then(res => {
            dispatch(addTodoListAC({todoList: res.data.data.item}))
            dispatch(setStatusAC({status: 'succeeded'}))
        })
};

export const changeTodoListTitleTC = (title: string, todoListId: string): AppThunk => (dispatch) => {
    todoListsApi.updateTodoListTitle(todoListId, title)
        .then(res => {
            dispatch(changeTodoListTitleAC({todoListId, title}))
        })
};

// types
export type TodoListDomainType = TodoListType & {
    filter: FilterValuesType,
    entityStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
};
export type FilterValuesType = 'all' | 'completed' | 'active';

export type RemoveTodoListActionType = ReturnType<typeof removeTodoListAC>;
export type AddTodoListActionType = ReturnType<typeof addTodoListAC>;
export type ChangeTodoListTitleActionType = ReturnType<typeof changeTodoListTitleAC>;
export type ChangeTodoListFilterActionType = ReturnType<typeof changeTodoListFilterAC>;
export type SetTodoListsActionType = ReturnType<typeof setTodoListsAC>;
export type ChangeTodoListEntityStatusActionType = ReturnType<typeof changeTodoListEntityStatusAC>;

// export type TodoListsActionsType = RemoveTodoListActionType
//     | AddTodoListActionType
//     | ChangeTodoListTitleActionType
//     | ChangeTodoListFilterActionType
//     | SetTodoListsActionType
//     | ChangeTodoListEntityStatusActionType;