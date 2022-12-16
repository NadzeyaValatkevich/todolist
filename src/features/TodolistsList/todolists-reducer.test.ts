import {v1} from "uuid";
import {
    addTodoListAC, changeTodoListEntityStatusAC, changeTodoListFilterAC,
    changeTodoListTitleAC, FilterValuesType,
    removeTodoListAC, setTodoListsAC, TodoListDomainType,
    todoListsReducer
} from "./todolists-reducer";

let todoListId1: string;
let todoListId2: string;
let startState: TodoListDomainType[];
beforeEach(() => {
    todoListId1 = v1();
    todoListId2 = v1();
    startState = [
        {id: todoListId1, title: 'What to learn', filter: 'all', addedDate: "", order: 0, entityStatus: 'idle'},
        {id: todoListId2, title: 'What to buy', filter: 'all', addedDate: "", order: 1, entityStatus: 'idle'}
    ]
});

test('correct todolist should be removed', () => {

    const endState = todoListsReducer(startState, removeTodoListAC(todoListId1))

    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todoListId2);
});

test('correct todolist should be added', () => {

    const action = addTodoListAC({
        id:'id exist',
        title:'New Todolist',
        addedDate:'',
        order: 0
    });

    const endState = todoListsReducer(startState, action)
    expect(endState.length).toBe(3);
    expect(endState[0].title).toBe('New Todolist');
    expect(endState[0].filter).toBe('all');
});

test('correct todolist should change its name', () => {

    const newTodoListTitle = 'New Todolist';

    const endState = todoListsReducer(startState, changeTodoListTitleAC(todoListId2, newTodoListTitle));

    expect(endState[0].title).toBe('What to learn');
    expect(endState[1].title).toBe(newTodoListTitle);
});

test('correct filter of todolist should be changed', () => {

    let newFilter:FilterValuesType = 'completed';

    const endState = todoListsReducer(startState, changeTodoListFilterAC(todoListId2, newFilter));

    expect(endState[0].filter).toBe('all');
    expect(endState[1].filter).toBe(newFilter);
});

test('todolists should be set to the state', () => {

    const endState = todoListsReducer([], setTodoListsAC(startState));
    expect(endState.length).toBe(2);
});

test('correct entity status of todolist should be changed', () => {

    let newStatus: 'idle' | 'loading' | 'succeeded' | 'failed' = 'loading';

    const endState = todoListsReducer(startState, changeTodoListEntityStatusAC(todoListId2, newStatus));

    expect(endState[0].entityStatus).toBe('idle');
    expect(endState[1].entityStatus).toBe('loading');
});