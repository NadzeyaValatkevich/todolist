import {todoListsApi} from "../../api/todolists-api";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {appActions} from "../CommonActions/AppActions";
import {
    handleAsyncServerAppError,
    handleAsyncServerNetworkError,
} from "../../utils/error-utils";
import {TodoListType} from "../../api/types";
import {ThunkError} from "../../utils/types";

export const fetchTodoLists = createAsyncThunk<{ todoLists: TodoListType[] }, undefined, ThunkError>('todoLists/fetchTodoLists', async (param, ThunkAPI
) => {
    ThunkAPI.dispatch(appActions.setStatus({status: 'loading'}));
    const res = await todoListsApi.getTodoLists();
    try {
        ThunkAPI.dispatch(appActions.setStatus({status: 'succeeded'}))
        return {todoLists: res.data}
    } catch (error: any) {
        return handleAsyncServerNetworkError(error, ThunkAPI)
    }
});

export const removeTodoList = createAsyncThunk<{ todoListId: string }, string, ThunkError>('todoLists/removeTodoList', async (todoListId, {dispatch}) => {
    dispatch(appActions.setStatus({status: 'loading'}))
    dispatch(changeTodoListEntityStatus({todoListId, entityStatus: 'loading'}))
    const res = await todoListsApi.deleteTodoList(todoListId)
    dispatch(appActions.setStatus({status: 'succeeded'}))
    return {todoListId}
});

export const createTodoList = createAsyncThunk<{ todoList: TodoListType }, string, ThunkError>(
    'todoLists/createTodoList', async (title: string, thunkAPI) => {
        thunkAPI.dispatch(appActions.setStatus({status: 'loading'}))
        try {
            const res = await todoListsApi.createTodoLists(title)
            if (res.data.resultCode === 0) {
                thunkAPI.dispatch(appActions.setStatus({status: 'succeeded'}))
                return {todoList: res.data.data.item}
            } else {
                return handleAsyncServerAppError(res.data, thunkAPI, false)
            }
        } catch (error) {
            return handleAsyncServerNetworkError(error, thunkAPI, false)
        }
    });

export const changeTodoListTitle = createAsyncThunk('todoLists/changeTodoListTitle', async (param: { title: string, todoListId: string }, thunkAPI) => {
    thunkAPI.dispatch(appActions.setStatus({status: 'loading'}))
    try {
        const res = await todoListsApi.updateTodoListTitle(param.todoListId, param.title)
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(appActions.setStatus({status: 'succeeded'}))
            return {title: param.title, todoListId: param.todoListId}
        } else {
            return handleAsyncServerAppError(res.data, thunkAPI)
        }
    } catch (error) {
        return handleAsyncServerNetworkError(error, thunkAPI, false)
    }
});

export const asyncActions = {
    fetchTodoLists,
    removeTodoList,
    createTodoList,
    changeTodoListTitle
};

export const slice = createSlice({
    name: 'todoLists',
    initialState: [] as TodoListDomainType[],
    reducers: {
        changeTodoListFilter(state, action: PayloadAction<{ todoListId: string, filter: FilterValuesType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todoListId);
            state[index].filter = action.payload.filter;
        },
        changeTodoListEntityStatus(state, action: PayloadAction<{ todoListId: string, entityStatus: 'idle' | 'loading' | 'succeeded' | 'failed' }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todoListId);
            state[index].entityStatus = action.payload.entityStatus;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTodoLists.fulfilled, (state, action) => {
                return action.payload.todoLists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
            })
            .addCase(removeTodoList.fulfilled, (state, action) => {
                const index = state.findIndex(tl => tl.id === action.payload.todoListId);
                if (index > -1) {
                    state.splice(index, 1)
                }
            })
            .addCase(createTodoList.fulfilled, (state, action) => {
                state.unshift({...action.payload.todoList, filter: 'all', entityStatus: 'idle'});
            })
            .addCase(changeTodoListTitle.fulfilled, (state, action) => {
                const index = state.findIndex(tl => tl.id === action.payload.todoListId);
                state[index].title = action.payload.title;
            });
    }
});

// export const todoListsReducer = slice.reducer;
export const {
    changeTodoListFilter,
    changeTodoListEntityStatus
} = slice.actions;

// types
export type TodoListDomainType = TodoListType & {
    filter: FilterValuesType,
    entityStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
};
export type FilterValuesType = 'all' | 'completed' | 'active';
