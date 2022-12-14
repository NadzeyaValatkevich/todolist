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

export type TodoListType = {
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
    todoListId: string,
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
export type UpdateTaskModelType = {
    title: string,
    description: string | null,
    status: number,
    priority: number,
    startDate: string | null,
    deadline: string | null
};
