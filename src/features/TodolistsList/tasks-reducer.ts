import {TasksStateType} from "../../app/App";
import {
    AddTodoListActionType,
    RemoveTodoListActionType,
    SetTodoListsActionType
} from "./todolists-reducer";
import {TaskType, todoListsApi, UpdateTaskModelType} from "../../api/todolists-api";
import {AppRootStateType, AppThunk} from "../../app/store";
import {setErrorAC, setStatusAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";

const initialState: TasksStateType = {};

export const tasksReducer = (state: TasksStateType = initialState, action: TasksActionsType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK':
            return {...state, [action.todoListId]: state[action.todoListId].filter(t => t.id !== action.taskId)}
        case 'ADD-TASK':
            return {...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]}
        case 'UPDATE-TASK':
            return {
                ...state,
                [action.todoListId]: state[action.todoListId]
                    .map(t => t.id === action.taskId ? {...t, ...action.model} : t)
            }
        case 'ADD-TODOLIST':
            return {[action.todoList.id]: [], ...state}
        case 'REMOVE-TODOLIST':
            const stateCopy = {...state}
            delete stateCopy[action.id]
            return stateCopy
        case 'SET-TODOLISTS': {
            const copyState = {...state}
            action.todoLists.forEach(tl => {
                copyState[tl.id] = [];
            })
            return copyState;
        }
            ;
        case 'SET-TASKS':
            return {...state, [action.todoListId]: action.tasks}
        default:
            return state
    }
};

// actions
export const removeTaskAC = (taskId: string, todoListId: string) =>
    ({
        type: 'REMOVE-TASK',
        taskId,
        todoListId
    } as const);
export const addTaskAC = (task: TaskType) => ({type: 'ADD-TASK', task} as const);
export const updateTaskAC = (taskId: string, todoListId: string, model: UpdateDomainTaskModelType) =>
    ({
        type: 'UPDATE-TASK',
        taskId,
        todoListId,
        model
    } as const);

export const setTasksAC = (todoListId: string, tasks: TaskType[]) =>
    ({
        type: 'SET-TASKS',
        todoListId,
        tasks
    } as const);

// thunks
export const fetchTasksTC = (todoListId: string): AppThunk => (dispatch) => {
    dispatch(setStatusAC('loading'))
    todoListsApi.getTasks(todoListId)
        .then(res => {
            dispatch(setTasksAC(todoListId, res.data.items))
            dispatch(setStatusAC('succeeded'))
        })
};

export const removeTaskTC = (todoListId: string, taskId: string): AppThunk => (dispatch) => {
    todoListsApi.deleteTask(todoListId, taskId)
        .then(res => {
            dispatch(removeTaskAC(taskId, todoListId))
        })
};

export const addTaskTC = (todoListId: string, title: string): AppThunk => (dispatch) => {
    dispatch(setStatusAC('loading'))
    todoListsApi.createTask(todoListId, title)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(addTaskAC(res.data.data.item));
                dispatch(setStatusAC('succeeded'))
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
        dispatch(setStatusAC('loading'))
        todoListsApi.updateTask(todoListId, taskId, appModel)
            .then(res => {
                if(res.data.resultCode === 0) {
                    dispatch(updateTaskAC(taskId, todoListId, domainModal))
                    dispatch(setStatusAC('succeeded'))
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
export type RemoveTaskActionType = ReturnType<typeof removeTaskAC>;
export type AddTaskActionType = ReturnType<typeof addTaskAC>;
export type UpdateTaskActionType = ReturnType<typeof updateTaskAC>;
export type SetTasksActionType = ReturnType<typeof setTasksAC>;

export type TasksActionsType = RemoveTaskActionType
    | AddTaskActionType
    | UpdateTaskActionType
    | AddTodoListActionType
    | RemoveTodoListActionType
    | SetTodoListsActionType
    | SetTasksActionType;

export type UpdateDomainTaskModelType = {
    title?: string,
    description?: string | null,
    status?: number,
    priority?: number,
    startDate?: string | null,
    deadline?: string | null
};