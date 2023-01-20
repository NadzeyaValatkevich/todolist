import {TasksStateType} from "../../app/App";
import {createTodoList, fetchTodoLists, removeTodoList} from "./todolists-reducer";
import {todoListsApi, UpdateTaskModelType} from "../../api/todolists-api";
import {AppRootStateType} from "../../app/store";
import {setStatusAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

const initialState: TasksStateType = {};

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

const slice = createSlice({
    name: 'tasks',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(createTodoList.fulfilled, (state, action) => {
            state[action.payload.todoList.id] = []
        });
        builder.addCase(removeTodoList.fulfilled, (state, action) => {
            delete state[action.payload.todoListId]
        });
        builder.addCase(fetchTodoLists.fulfilled, (state, action) => {
            action.payload.todoLists.forEach((tl: any) => {
                state[tl.id] = [];
            })
        });
        builder.addCase(fetchTasks.fulfilled, (state, action) => {
            state[action.payload.todoListId] = action.payload.tasks;
        });
        builder.addCase(removeTask.fulfilled, (state, action) => {
            const tasks = state[action.payload.todoListId];
            const index = tasks.findIndex(t => t.id === action.payload.taskId);
            if (index > -1) {
                tasks.splice(index, 1)
            }
        });
        builder.addCase(addTaskTC.fulfilled, (state, action) => {
            state[action.payload.todoListId].unshift(action.payload);
        });
        builder.addCase(updateTask.fulfilled, (state, action) => {
            const tasks = state[action.payload.todoListId];
            const index = tasks.findIndex(t => t.id === action.payload.taskId);
            if (index > -1) {
                tasks[index] = {...tasks[index], ...action.payload.domainModel}
            }
        });
    }
});


export const tasksReducer = slice.reducer;

export type UpdateDomainTaskModelType = {
    title?: string,
    description?: string | null,
    status?: number,
    priority?: number,
    startDate?: string | null,
    deadline?: string | null
};