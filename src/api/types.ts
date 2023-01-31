export type LoginParamsType = {
    email: string,
    password: string,
    rememberMe: boolean,
    captcha?: boolean
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
export type FieldErrorType = {field: string, error: string}
export type ResponseType<D = {}> = {
    resultCode: number,
    messages: string[],
    fieldsErrors?: Array<FieldErrorType>,
    data: D
};
export type GetTasksResponseType = {
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