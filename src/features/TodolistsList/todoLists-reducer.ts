import {todoListsApi, TodoListType} from "../../api/todolists-api";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {setStatusAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";

export const fetchTodoLists = createAsyncThunk('todoLists/fetchTodoLists', async (param, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setStatusAC({status: 'loading'}));
    const res = await todoListsApi.getTodoLists();
    try {
        dispatch(setStatusAC({status: 'succeeded'}))
        return {todoLists: res.data}
    } catch (error: any) {
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    }
});

export const removeTodoList = createAsyncThunk('todoLists/removeTodoList', async (todoListId: string, {dispatch}) => {
    dispatch(setStatusAC({status: 'loading'}))
    dispatch(changeTodoListEntityStatusAC({todoListId, entityStatus: 'loading'}))
    const res = await todoListsApi.deleteTodoList(todoListId)
    dispatch(setStatusAC({status: 'succeeded'}))
    return {todoListId}
});

export const createTodoList = createAsyncThunk('todoLists/createTodoList', async (title: string, {dispatch, rejectWithValue}) => {
    dispatch(setStatusAC({status: 'loading'}))
    try {
        const res = await todoListsApi.createTodoLists(title)
        if(res.data.resultCode === 0) {
            dispatch(setStatusAC({status: 'succeeded'}))
            return {todoList: res.data.data.item}
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }
    } catch (error: any) {
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    }
});

export const changeTodoListTitle = createAsyncThunk('todoLists/changeTodoListTitle', async (param: {title: string, todoListId: string}, {dispatch}) => {
    dispatch(setStatusAC({status: 'loading'}))
    await todoListsApi.updateTodoListTitle(param.todoListId, param.title)
    dispatch(setStatusAC({status: 'succeeded'}))
    return {title: param.title, todoListId:param.todoListId}
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
        changeTodoListEntityStatusAC(state, action: PayloadAction<{ todoListId: string, entityStatus: 'idle' | 'loading' | 'succeeded' | 'failed' }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todoListId);
            state[index].entityStatus = action.payload.entityStatus;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchTodoLists.fulfilled, (state, action) => {
            return action.payload.todoLists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        });
        builder.addCase(removeTodoList.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.todoListId);
            if (index > -1) {
                state.splice(index, 1)
            }
        });
        builder.addCase(createTodoList.fulfilled, (state, action) => {
            state.unshift({...action.payload.todoList, filter: 'all', entityStatus: 'idle'});
        });
        builder.addCase(changeTodoListTitle.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.todoListId);
            state[index].title = action.payload.title;
        });
    }
});

export const todoListsReducer = slice.reducer;
export const {
    changeTodoListFilter,
    changeTodoListEntityStatusAC
} = slice.actions;

// types
export type TodoListDomainType = TodoListType & {
    filter: FilterValuesType,
    entityStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
};
export type FilterValuesType = 'all' | 'completed' | 'active';
