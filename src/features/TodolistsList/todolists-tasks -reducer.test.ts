import {TasksStateType} from "../../app/App";
import {TodoListDomainType, slice} from "./todoLists-reducer";
import {slice as tasksSlice} from './tasks-reducer';
import {todoListsActions} from './';


const todoListsReducer = slice.reducer;
const tasksReducer = tasksSlice.reducer;


test('ids should be equals', () => {
    const startTasksState: TasksStateType = {};
    const startTodoListsState: TodoListDomainType[] = [];
    const todoList = {
        id: 'id exist',
        title: 'New Todolist',
        addedDate: '',
        order: 0
    };

    const action = todoListsActions.createTodoList.fulfilled({todoList}, 'requestId', todoList.title);
    const endTasksState = tasksReducer(startTasksState, action)
    const endTodoListsState = todoListsReducer(startTodoListsState, action)

    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodoLists = endTodoListsState[0].id;

    expect(idFromTasks).toBe(action.payload.todoList.id);
    expect(idFromTodoLists).toBe(action.payload.todoList.id);
});