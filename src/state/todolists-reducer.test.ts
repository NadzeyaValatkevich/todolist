import {v1} from "uuid";
import {
    addTodolistAC, changeTodolistFilterAC,
    changeTodolistTitleAC, FilterValuesType,
    removeTodolistAC, TodolistDomainType,
    todolistsReducer
} from "./todolists-reducer";

test('correct todolist should be removed', () => {
    const todolistId1 = v1()
    const todolistId2 = v1()

    const startState: TodolistDomainType[] = [
        {id: todolistId1, title: 'What to learn', filter: 'all', addedDate: "", order: 0},
        {id: todolistId2, title: 'What to buy', filter: 'all', addedDate: "", order: 1}
    ]

    const endState = todolistsReducer(startState, removeTodolistAC(todolistId1))

    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todolistId2);
});

test('correct todolist should be added', () => {
    const todolistId1 = v1();
    const todolistId2 = v1();

    const newTodolistTitle = 'New Todolist';

    const startState: TodolistDomainType[] = [
        {id: todolistId1, title: 'What to learn', filter: 'all', addedDate: "", order: 0},
        {id: todolistId2, title: 'What to buy', filter: 'all', addedDate: "", order: 1}
    ]

    const endState = todolistsReducer(startState, addTodolistAC(newTodolistTitle))
    expect(endState.length).toBe(3);
    expect(endState[0].title).toBe(newTodolistTitle);
    expect(endState[0].filter).toBe('all');
});

test('correct todolist should change its name', () => {
    const todolistId1 = v1();
    const todolistId2 = v1();

    const newTodolistTitle = 'New Todolist';
    const startState: TodolistDomainType[] = [
        {id: todolistId1, title: 'What to learn', filter: 'all', addedDate: "", order: 0},
        {id: todolistId2, title: 'What to buy', filter: 'all', addedDate: "", order: 1}
    ];

    const endState = todolistsReducer(startState, changeTodolistTitleAC(todolistId2, newTodolistTitle));

    expect(endState[0].title).toBe('What to learn');
    expect(endState[1].title).toBe(newTodolistTitle);
});

test('correct filter of todolist should be changed', () => {
    const todolistId1 = v1();
    const todolistId2 = v1();

    let newFilter:FilterValuesType = 'completed';
    const startState: TodolistDomainType[] = [
        {id: todolistId1, title: 'What to learn', filter: 'all', addedDate: "", order: 0},
        {id: todolistId2, title: 'What to buy', filter: 'all', addedDate: "", order: 0}
    ];

    const endState = todolistsReducer(startState, changeTodolistFilterAC(todolistId2, newFilter));

    expect(endState[0].filter).toBe('all');
    expect(endState[1].filter).toBe(newFilter);
});