import {todoListsApi, TodoListType} from "../../api/todolists-api";
import {AppThunk} from "../../app/store";
import {setStatusAC} from "../../app/app-reducer";
import {handleServerNetworkError} from "../../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

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

export const createTodoList = createAsyncThunk('todoLists/createTodoList', async (title: string, {dispatch}) => {
    dispatch(setStatusAC({status: 'loading'}))
    const res = await todoListsApi.createTodoLists(title)
    dispatch(setStatusAC({status: 'succeeded'}))
    return {todoList: res.data.data.item}
});

export const changeTodoListTitleTC = createAsyncThunk('todoLists/changeTodoListTitle', async (param: {title: string, todoListId: string}, {dispatch}) => {
    dispatch(setStatusAC({status: 'loading'}))
    await todoListsApi.updateTodoListTitle(param.todoListId, param.title)
    dispatch(setStatusAC({status: 'succeeded'}))
    return {title: param.title, todoListId:param.todoListId}
});

const slice = createSlice({
    name: 'todoLists',
    initialState: [] as TodoListDomainType[],
    reducers: {
        changeTodoListFilterAC(state, action: PayloadAction<{ todoListId: string, filter: FilterValuesType }>) {
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
        builder.addCase(changeTodoListTitleTC.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.todoListId);
            state[index].title = action.payload.title;
        });
    }
});

export const todoListsReducer = slice.reducer;
export const {
    changeTodoListFilterAC,
    changeTodoListEntityStatusAC
} = slice.actions;

// types
export type TodoListDomainType = TodoListType & {
    filter: FilterValuesType,
    entityStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
};
export type FilterValuesType = 'all' | 'completed' | 'active';
