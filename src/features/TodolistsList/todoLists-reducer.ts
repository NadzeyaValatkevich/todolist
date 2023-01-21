import {TodoListType} from "../../api/todolists-api";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {changeTodoListTitleTC, createTodoList, fetchTodoLists, removeTodoList} from "./todoLists-actions";

export const slice = createSlice({
    name: 'todoLists',
    initialState: [] as TodoListDomainType[],
    reducers: {
        changeTodoListFilterAC(state, action: PayloadAction<{ todoListId: string, filter: FilterValuesType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todoListId);
            state[index].filter = action.payload.filter;
        },
        changeTodoListEntityStatusAC(state, action: PayloadAction<{ todoListId: string, entityStatus: 'idle' | 'loading' | 'succeeded' | 'failed' }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todoListId);
            state[index].entityStatus = action.payload.entityStatus;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchTodoLists.fulfilled, (state, action) => {
            return action.payload.todoLists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        });
        builder.addCase(removeTodoList.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.todoListId);
            if (index > -1) {
                state.splice(index, 1)
            }
        });
        builder.addCase(createTodoList.fulfilled, (state, action) => {
            state.unshift({...action.payload.todoList, filter: 'all', entityStatus: 'idle'});
        });
        builder.addCase(changeTodoListTitleTC.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.todoListId);
            state[index].title = action.payload.title;
        });
    }
});

export const todoListsReducer = slice.reducer;
export const {
    changeTodoListFilterAC,
    changeTodoListEntityStatusAC
} = slice.actions;

// types
export type TodoListDomainType = TodoListType & {
    filter: FilterValuesType,
    entityStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
};
export type FilterValuesType = 'all' | 'completed' | 'active';
