import {TasksStateType} from "../../app/App";
import {createTodoList, fetchTodoLists, removeTodoList} from "./todoLists-reducer";
import {createSlice} from "@reduxjs/toolkit";
import {addTaskTC, fetchTasks, removeTask, updateTask} from "./tasks-actions";

const initialState: TasksStateType = {};

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