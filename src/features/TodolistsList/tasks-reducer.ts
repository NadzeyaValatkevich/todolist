import {TasksStateType} from "../../app/App";
import {
    addTodoListAC,
    AddTodoListActionType, removeTodoListAC,
    RemoveTodoListActionType, setTodoListsAC,
    SetTodoListsActionType
} from "./todolists-reducer";
import {TaskType, todoListsApi, UpdateTaskModelType} from "../../api/todolists-api";
import {AppRootStateType, AppThunk} from "../../app/store";
import {setErrorAC, setStatusAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

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

const slice = createSlice({
    name: 'tasks',
    initialState: initialState,
    reducers: {
        // removeTaskAC(state, action: PayloadAction<{ taskId: string, todoListId: string }>) {
        //     const tasks = state[action.payload.todoListId];
        //     const index = tasks.findIndex(t => t.id === action.payload.taskId);
        //     if (index > -1) {
        //         tasks.splice(index, 1)
        //     }
        // },
        addTaskAC(state, action: PayloadAction<TaskType>) {
            state[action.payload.todoListId].unshift(action.payload)
        },
        updateTaskAC(state, action: PayloadAction<{ taskId: string, todoListId: string, model: UpdateDomainTaskModelType }>) {
            const tasks = state[action.payload.todoListId];
            const index = tasks.findIndex(t => t.id === action.payload.taskId);
            if (index > -1) {
                tasks[index] = {...tasks[index], ...action.payload.model}
            }
        },
        // setTasksAC(state, action: PayloadAction<{todoListId: string, tasks: TaskType[]}>) {
        // state[action.payload.todoListId] = action.payload.tasks
        // },
    },
    extraReducers: (builder) => {
        builder.addCase(addTodoListAC, (state, action) => {
            state[action.payload.todoList.id] = []
        });
        builder.addCase(removeTodoListAC, (state, action) => {
            delete state[action.payload.todoListId]
        });
        builder.addCase(setTodoListsAC, (state, action) => {
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
    }
});


export const tasksReducer = slice.reducer;
export const {addTaskAC, updateTaskAC} = slice.actions;

// thunks

export const addTaskTC = (todoListId: string, title: string): AppThunk => (dispatch) => {
    dispatch(setStatusAC({status: 'loading'}))
    todoListsApi.createTask(todoListId, title)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(addTaskAC(res.data.data.item));
                dispatch(setStatusAC({status: 'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
        })
};

export const updateTaskTC = (todoListId: string, taskId: string, domainModal: UpdateDomainTaskModelType): AppThunk => {
    return (dispatch, getState: () => AppRootStateType) => {
        const state = getState();
        const task = state.tasks[todoListId].find(t => t.id === taskId);
        if (!task) {
            console.warn('task not found in the state');
            return
        }
        ;
        const appModel: UpdateTaskModelType = {
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.startDate,
            ...domainModal
        }
        dispatch(setStatusAC({status: 'loading'}))
        todoListsApi.updateTask(todoListId, taskId, appModel)
            .then(res => {
                if (res.data.resultCode === 0) {
                    dispatch(updateTaskAC({taskId, todoListId, model: domainModal}))
                    dispatch(setStatusAC({status: 'succeeded'}))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch(error => {
                handleServerNetworkError(error, dispatch)
            })
    }
};

// types
// export type RemoveTaskActionType = ReturnType<typeof removeTaskAC>;
// export type AddTaskActionType = ReturnType<typeof addTaskAC>;
// export type UpdateTaskActionType = ReturnType<typeof updateTaskAC>;
// export type SetTasksActionType = ReturnType<typeof setTasksAC>;

// export type TasksActionsType = RemoveTaskActionType
//     | AddTaskActionType
//     | UpdateTaskActionType
//     | AddTodoListActionType
//     | RemoveTodoListActionType
//     | SetTodoListsActionType
//     | SetTasksActionType;

export type UpdateDomainTaskModelType = {
    title?: string,
    description?: string | null,
    status?: number,
    priority?: number,
    startDate?: string | null,
    deadline?: string | null
};