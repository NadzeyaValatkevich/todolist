import {TasksStateType} from "../../app/App";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {appActions} from "../CommonActions/AppActions";
import {todoListsApi} from "../../api/todolists-api";
import {
    handleAsyncServerAppError,
    handleAsyncServerNetworkError,
} from "../../utils/error-utils";
import {asyncActions as asyncTodoListsActions} from "./todoLists-reducer";
import {TaskType, UpdateTaskModelType} from "../../api/types";
import {AppRootStateType, ThunkError} from "../../utils/types";

const initialState: TasksStateType = {};

export const fetchTasks = createAsyncThunk<{ todoListId: string, tasks: TaskType[] }, string, ThunkError>('tasks/fetchTasks', async (todoListId, thunkAPI) => {
    thunkAPI.dispatch(appActions.setStatus({status: 'loading'}))
    try {
        const res = await todoListsApi.getTasks(todoListId);
        const tasks = res.data.items;
        thunkAPI.dispatch(appActions.setStatus({status: 'succeeded'}))
        return {todoListId, tasks}
    } catch (error) {
        return handleAsyncServerNetworkError(error, thunkAPI)
    }
});

export const removeTask = createAsyncThunk<{ taskId: string, todoListId: string }, { todoListId: string, taskId: string }, ThunkError>('tasks/removeTask', async (param, thunkAPI) => {
    thunkAPI.dispatch(appActions.setStatus({status: 'loading'}))
    const res = await todoListsApi.deleteTask(param.todoListId, param.taskId)
    thunkAPI.dispatch(appActions.setStatus({status: 'succeeded'}))
    return {taskId: param.taskId, todoListId: param.todoListId}
});

export const addTask = createAsyncThunk<TaskType, { todoListId: string, title: string },
    ThunkError>('tasks/addTaskTC', async (param, thunkAPI) => {
    thunkAPI.dispatch(appActions.setStatus({status: 'loading'}));
    try {
        const res = await todoListsApi.createTask(param.todoListId, param.title)
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(appActions.setStatus({status: 'succeeded'}))
            return res.data.data.item
        } else {
            return handleAsyncServerAppError(res.data, thunkAPI)
        }
    } catch (error) {
        return handleAsyncServerNetworkError(error, thunkAPI, false)
    }
});

export const updateTask = createAsyncThunk('tasks/updateTask', async (param: { todoListId: string, taskId: string, domainModel: UpdateDomainTaskModelType }, ThunkAPI
) => {
    const state = ThunkAPI.getState() as AppRootStateType;
    const task = state.tasks[param.todoListId].find(t => t.id === param.taskId);
    if (!task) {
        console.warn('task not found in the state');
        return ThunkAPI.rejectWithValue('task not found in the state')
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
    ThunkAPI.dispatch(appActions.setStatus({status: 'loading'}))
    const res = await todoListsApi.updateTask(param.todoListId, param.taskId, appModel)
    try {
        if (res.data.resultCode === 0) {
            ThunkAPI.dispatch(appActions.setStatus({status: 'succeeded'}))
            return param
        } else {
            return handleAsyncServerAppError(res.data, ThunkAPI)
        }
    } catch (error: any) {
        return handleAsyncServerNetworkError(error, ThunkAPI)
    }
});

export const asyncActions = {
    fetchTasks,
    removeTask,
    addTask,
    updateTask
};

export const slice = createSlice({
    name: 'tasks',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(asyncTodoListsActions.createTodoList.fulfilled, (state, action) => {
                state[action.payload.todoList.id] = []
            })
            .addCase(asyncTodoListsActions.removeTodoList.fulfilled, (state, action) => {
                delete state[action.payload.todoListId]
            })
            .addCase(asyncTodoListsActions.fetchTodoLists.fulfilled, (state, action) => {
                action.payload.todoLists.forEach((tl: any) => {
                    state[tl.id] = [];
                })
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state[action.payload.todoListId] = action.payload.tasks;
            })
            .addCase(removeTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todoListId];
                const index = tasks.findIndex(t => t.id === action.payload.taskId);
                if (index > -1) {
                    tasks.splice(index, 1)
                }
            })
            .addCase(addTask.fulfilled, (state, action) => {
                state[action.payload.todoListId].unshift(action.payload);
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todoListId];
                const index = tasks.findIndex(t => t.id === action.payload.taskId);
                if (index > -1) {
                    tasks[index] = {...tasks[index], ...action.payload.domainModel}
                }
            });
    }
});

// export const tasksReducer = slice.reducer;

export type UpdateDomainTaskModelType = {
    title?: string,
    description?: string | null,
    status?: number,
    priority?: number,
    startDate?: string | null,
    deadline?: string | null
};