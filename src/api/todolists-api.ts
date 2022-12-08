import axios from "axios";

const settings = {
    withCredentials: true,
    headers: {
        "API-KEY": "34703736-4385-4a40-886f-8a50a0865c2b"
    }
};

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    ...settings
})

export type TodolistType = {
    id:string,
    title:string,
    addedDate:string,
    order: number
};
export enum TaskStatuses {
    New,
    InProgress,
    Completed,
    Droft
};
export enum TaskPriorities {
    Low,
    Middle,
    H1,
    Urgently,
    Laten
};

export type TaskType = {
    description: string | null,
    title: string,
    status: TaskStatuses,
    priority: TaskPriorities,
    startDate: string | null,
    deadline: string | null,
    id: string,
    todolistId: string,
    order: number,
    addedDate: string
};

type ResponseType<D = {}> = {
    resultCode: number,
    messages: string[],
    fieldsErrors: string[],
    data: D
};

type GetTasksResponseType = {
    totalCount: number,
    error: string | null,
    items: TaskType[]
};

type updateTaskTitle = {
    title: string,
    description: string,
    status: number,
    priority: number,
    startDate: string,
    deadline: string
};

export const todolistsApi = {
    getTodolists() {
        return (instance.get<TodolistType[]>('todo-lists'))
    },
    createTodolists(title: string) {
        return (instance.post<ResponseType<{item: TodolistType}>>('todo-lists', {title}))
    },
    deleteTodolists(todolistId: string) {
        return (instance.delete<ResponseType>(`todo-lists/${todolistId}`))
    },
    updateTodolists(todolistId: string, title: string) {
        return (instance.put<ResponseType>(`todo-lists/${todolistId}`, {title}))
    },
    getTasks(todolistId: string) {
        return (instance.get<GetTasksResponseType>(`todo-lists/${todolistId}/tasks`))
    },
    deleteTask(todolistId: string, taskId: string) {
        return (instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`))
    },
    createTask(todolistId: string, title: string) {
        return(instance.post<ResponseType<{item: TaskType}>>(`todo-lists/${todolistId}/tasks`, {title}))
    },
};