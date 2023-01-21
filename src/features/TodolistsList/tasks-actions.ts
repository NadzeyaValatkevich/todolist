import {createAsyncThunk} from "@reduxjs/toolkit";
import {setStatusAC} from "../../app/app-reducer";
import {todoListsApi, UpdateTaskModelType} from "../../api/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {AppRootStateType} from "../../app/store";
import {UpdateDomainTaskModelType} from "./tasks-reducer";

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (todoListId: string, thunkAPI) => {
    thunkAPI.dispatch(setStatusAC({status: 'loading'}))
    const res = await todoListsApi.getTasks(todoListId)
    thunkAPI.dispatch(setStatusAC({status: 'succeeded'}))
    return {todoListId, tasks: res.data.items}
});

export const removeTask = createAsyncThunk('tasks/removeTask', async (param: { todoListId: string, taskId: string }, thunkAPI) => {
    thunkAPI.dispatch(setStatusAC({status: 'loading'}))
    const res = await todoListsApi.deleteTask(param.todoListId, param.taskId)
    thunkAPI.dispatch(setStatusAC({status: 'succeeded'}))
    return {taskId: param.taskId, todoListId: param.todoListId}
});

export const addTaskTC = createAsyncThunk('tasks/addTaskTC', async (param: {todoListId: string, title: string}, {dispatch, rejectWithValue}) => {
    dispatch(setStatusAC({status: 'loading'}));
    try {
        const res = await todoListsApi.createTask(param.todoListId, param.title)
        if (res.data.resultCode === 0) {
            dispatch(setStatusAC({status: 'succeeded'}))
            return res.data.data.item
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }
    } catch(error: any) {
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    }
});

export const updateTask = createAsyncThunk('tasks/updateTask', async (param: {todoListId: string, taskId: string, domainModel: UpdateDomainTaskModelType}, {dispatch, getState, rejectWithValue}) => {
    const state = getState() as AppRootStateType;
    const task = state.tasks[param.todoListId].find(t => t.id === param.taskId);
    if (!task) {
        console.warn('task not found in the state');
        return rejectWithValue('task not found in the state')
    };
    const appModel: UpdateTaskModelType = {
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        startDate: task.startDate,
        deadline: task.startDate,
        ...param.domainModel
    }
    dispatch(setStatusAC({status: 'loading'}))
    const res = await todoListsApi.updateTask(param.todoListId, param.taskId, appModel)
    try {
        if (res.data.resultCode === 0) {
            dispatch(setStatusAC({status: 'succeeded'}))
            return param
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }
    } catch(error:any) {
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    }
});