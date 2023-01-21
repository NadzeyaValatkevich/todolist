import {createAsyncThunk} from "@reduxjs/toolkit";
import {setStatusAC} from "../../app/app-reducer";
import {todoListsApi} from "../../api/todolists-api";
import {handleServerNetworkError} from "../../utils/error-utils";
import {changeTodoListEntityStatusAC} from "./todoLists-reducer";

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