import axios from "axios";
import {GetTasksResponseType, LoginParamsType, TaskType, TodoListType, UpdateTaskModelType, ResponseType} from "./types";

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

export const todoListsApi = {
    getTodoLists() {
        return (instance.get<TodoListType[]>('todo-lists'))
    },
    createTodoLists(title: string) {
        return (instance.post<ResponseType<{item: TodoListType}>>('todo-lists', {title}))
    },
    deleteTodoList(todoListId: string) {
        return (instance.delete<ResponseType>(`todo-lists/${todoListId}`))
    },
    updateTodoListTitle(todoListId: string, title: string) {
        return (instance.put<ResponseType>(`todo-lists/${todoListId}`, {title}))
    },
    getTasks(todoListId: string) {
        return (instance.get<GetTasksResponseType>(`todo-lists/${todoListId}/tasks`))
    },
    deleteTask(todoListId: string, taskId: string) {
        return (instance.delete<ResponseType>(`todo-lists/${todoListId}/tasks/${taskId}`))
    },
    createTask(todoListId: string, title: string) {
        return(instance.post<ResponseType<{item: TaskType}>>(`todo-lists/${todoListId}/tasks`, {title}))
    },
    updateTask(todoListId: string, taskId: string, model:UpdateTaskModelType) {
        return(instance.put(`todo-lists/${todoListId}/tasks/${taskId}`, model))
    },
};

export const authApi = {
    login(data: LoginParamsType) {
        return(instance.post<ResponseType<{userId?: number}>>(`auth/login`, data))
    },
    logout() {
        return(instance.delete<ResponseType<{userId?: number}>>(`auth/login`))
    },
    me() {
        return(instance.get<ResponseType<{id: number, email: string, login: string}>>('auth/me'))
    }
};
