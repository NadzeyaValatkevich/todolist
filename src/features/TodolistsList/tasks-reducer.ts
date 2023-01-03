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
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: TasksStateType = {};

const slice = createSlice( {
    name: 'tasks',
    initialState: initialState,
    reducers: {
        removeTaskAC(state, action: PayloadAction<{taskId: string, todoListId: string}>) {
            const tasks = state[action.payload.todoListId];
            const index = tasks.findIndex(t => t.id === action.payload.taskId);
            if(index > -1) {
                tasks.splice(index, 1)
            }
        },
        addTaskAC(state, action: PayloadAction<{task: TaskType}>) {
            state[action.payload.task.todoListId].unshift(action.payload.task)
        },
        updateTaskAC(state, action: PayloadAction<{taskId: string, todoListId: string, model: UpdateDomainTaskModelType}>) {
            const tasks = state[action.payload.todoListId];
            const index = tasks.findIndex(t => t.id === action.payload.taskId);
            if(index > -1) {
                tasks[index] = {...tasks[index], ...action.payload.model}
            }
        },
        setTasksAC(state, action: PayloadAction<{todoListId: string, tasks: TaskType[]}>) {
        state[action.payload.todoListId] = action.payload.tasks
        },
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
    }
});

export const tasksReducer = slice.reducer;
export const {removeTaskAC, addTaskAC, updateTaskAC, setTasksAC} = slice.actions;

// thunks
export const fetchTasksTC = (todoListId: string): AppThunk => (dispatch) => {
    dispatch(setStatusAC({status: 'loading'}))
    todoListsApi.getTasks(todoListId)
        .then(res => {
            dispatch(setTasksAC({todoListId, tasks: res.data.items}))
            dispatch(setStatusAC({status: 'succeeded'}))
        })
};

export const removeTaskTC = (todoListId: string, taskId: string): AppThunk => (dispatch) => {
    todoListsApi.deleteTask(todoListId, taskId)
        .then(res => {
            dispatch(removeTaskAC({taskId, todoListId}))
        })
};

export const addTaskTC = (todoListId: string, title: string): AppThunk => (dispatch) => {
    dispatch(setStatusAC({status: 'loading'}))
    todoListsApi.createTask(todoListId, title)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(addTaskAC({task: res.data.data.item}));
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
                if(res.data.resultCode === 0) {
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