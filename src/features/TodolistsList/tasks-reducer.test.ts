import {TasksStateType} from "../../app/App";
import {addTaskAC, removeTaskAC, setTasksAC, tasksReducer, updateTaskAC} from "./tasks-reducer";
import {addTodoListAC, removeTodoListAC, setTodoListsAC} from "./todolists-reducer";
import {TaskPriorities, TaskStatuses} from "../../api/todolists-api";

let startState: TasksStateType = {};
beforeEach(() => {
    startState = {
        'todoListId1': [
            {
                id: '1', title: 'CSS', todoListId: 'todoListId1', status: TaskStatuses.New,
                description: "", priority: TaskPriorities.Low, startDate: "", deadline: "", order: 0, addedDate: ""
            },
            {
                id: '2', title: 'JS', todoListId: 'todoListId1', status: TaskStatuses.Completed,
                description: "", priority: TaskPriorities.Low, startDate: "", deadline: "", order: 1, addedDate: ""
            },
            {
                id: '3', title: 'React', todoListId: 'todoListId1', status: TaskStatuses.New,
                description: "", priority: TaskPriorities.Low, startDate: "", deadline: "", order: 2, addedDate: ""
            },
        ],
        'todoListId2': [
            {
                id: '1', title: 'bread', todoListId: 'todoListId2', status: TaskStatuses.New,
                description: "", priority: TaskPriorities.Low, startDate: "", deadline: "", order: 0, addedDate: ""
            },
            {
                id: '2', title: 'milk', todoListId: 'todoListId2', status: TaskStatuses.Completed,
                description: "", priority: TaskPriorities.Low, startDate: "", deadline: "", order: 1, addedDate: ""
            },
            {
                id: '3', title: 'tea', todoListId: 'todoListId2', status: TaskStatuses.Completed,
                description: "", priority: TaskPriorities.Low, startDate: "", deadline: "", order: 2, addedDate: ""
            },
        ]
    }
})
test('correct task should be deleted from correct array', () => {

    const action = removeTaskAC({taskId: '2', todoListId: 'todoListId2'});
    const endState = tasksReducer(startState, action);

    expect(endState['todoListId1'].length).toBe(3)
    expect(endState['todoListId2'].length).toBe(2)
    expect(endState['todoListId2'].every(t => t.id !== '2')).toBeTruthy()
});

test('correct task should be added to correct array', () => {
    const action = addTaskAC({
        todoListId: 'todoListId2',
        title: 'coffee',
        deadline: '',
        description: '',
        addedDate: '',
        status: TaskStatuses.New,
        order: 0,
        priority: 0,
        startDate: '',
        id: 'id exist'
    });

    const endState = tasksReducer(startState, action);

    expect(endState['todoListId1'].length).toBe(3)
    expect(endState['todoListId2'].length).toBe(4)
    expect(endState['todoListId2'][0].id).toBeDefined()
    expect(endState['todoListId2'][0].title).toBe('coffee')
    expect(endState['todoListId2'][0].status).toBe(TaskStatuses.New)
});

test('status of specified task should be changed', () => {
    const action = updateTaskAC({
        taskId: '2', todoListId: 'todoListId2', model: {status: TaskStatuses.New}
    });
    const endState = tasksReducer(startState, action);

    expect(endState['todoListId2'][1].status).toBeFalsy()
    expect(endState['todoListId1'][1].status).toBeTruthy()
});

test('title of specified task should be changed', () => {
    const action = updateTaskAC({taskId: '2', todoListId: 'todoListId2', model: {title: 'cake'}});
    const endState = tasksReducer(startState, action);

    expect(endState['todoListId2'][1].title).toBe('cake')
    expect(endState['todoListId1'][1].title).toBe('JS')
});

test('new property with new array should be added when new todolist is added', () => {
    const action = addTodoListAC({todoList: {
        id: 'id exist',
        title: 'title no matter',
        addedDate: '',
        order: 0
    }});
    const endState = tasksReducer(startState, action);

    const keys = Object.keys(endState);
    const newKey = keys.find(k => k !== 'todoListId1' && k !== 'todoListId2');
    if (!newKey) {
        throw Error('new key should be added')
    }
    ;

    expect(keys.length).toBe(3);
    expect(endState[newKey]).toEqual([])
});

test('property with todolistId should be deleted', () => {
    const action = removeTodoListAC({todoListId: 'todoListId2'});
    const endState = tasksReducer(startState, action);

    const keys = Object.keys(endState);

    expect(keys.length).toBe(1);
    expect(endState['todoListId2']).toBeUndefined();
});

test('empty arrays should be added when we set todoLists', () => {
    const action = setTodoListsAC({todoLists: [
        {id: '1', title: 'What to learn', addedDate: "", order: 0},
        {id: '2', title: 'What to buy', addedDate: "", order: 1}
    ]});
    const endState = tasksReducer({}, action);

    const keys = Object.keys(endState);

    expect(keys.length).toBe(2);
    expect(endState['1']).toStrictEqual([]);
    expect(endState['2']).toStrictEqual([]);
});
test('tasks should be added for todolist', () => {
    const action = setTasksAC({todoListId: 'todoListId1', tasks: startState['todoListId1']});
    const endState = tasksReducer({
        'todoListId1': [],
        'todoListId2': []
    }, action);

    expect(endState['todoListId1'].length).toBe(3);
    expect(endState['todoListId2'].length).toBe(0);
});