import {TasksStateType} from "../AppWithRedux";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer} from "./tasks-reducer";
import {addTodolistAC, removeTodolistAC} from "./todolists-reducer";
import {TaskPriorities, TaskStatuses} from "../api/todolists-api";

let startState: TasksStateType = {};
beforeEach(() => {
    startState = {
        'todolistId1': [
            {id: '1', title: 'CSS', todolistId: 'todolistId1', status: TaskStatuses.New,
                description: "", priority: TaskPriorities.Low, startDate: "", deadline: "", order: 0, addedDate: ""},
            {id: '2', title: 'JS', todolistId: 'todolistId1', status: TaskStatuses.Completed,
                description: "", priority: TaskPriorities.Low, startDate: "", deadline: "", order: 1, addedDate: ""},
            {id: '3', title: 'React', todolistId: 'todolistId1', status: TaskStatuses.New,
                description: "", priority: TaskPriorities.Low, startDate: "", deadline: "", order: 2, addedDate: ""},
        ],
        'todolistId2': [
            {id: '1', title: 'bread', todolistId: 'todolistId2', status: TaskStatuses.New,
                description: "", priority: TaskPriorities.Low, startDate: "", deadline: "", order: 0, addedDate: ""},
            {id: '2', title: 'milk', todolistId: 'todolistId2', status: TaskStatuses.Completed,
                description: "", priority: TaskPriorities.Low, startDate: "", deadline: "", order: 1, addedDate: ""},
            {id: '3', title: 'tea', todolistId: 'todolistId2', status: TaskStatuses.Completed,
                description: "", priority: TaskPriorities.Low, startDate: "", deadline: "", order: 2, addedDate: ""},
        ]
    }
})
test('correct task should be deleted from correct array', () => {

    const action = removeTaskAC('2', 'todolistId2');
    const endState = tasksReducer(startState, action);

    expect(endState['todolistId1'].length).toBe(3)
    expect(endState['todolistId2'].length).toBe(2)
    expect(endState['todolistId2'].every(t => t.id !== '2')).toBeTruthy()
});

test('correct task should be added to correct array', () => {
    const action = addTaskAC('coffee', 'todolistId2');
    const endState = tasksReducer(startState, action);

    expect(endState['todolistId1'].length).toBe(3)
    expect(endState['todolistId2'].length).toBe(4)
    expect(endState['todolistId2'][0].id).toBeDefined()
    expect(endState['todolistId2'][0].title).toBe('coffee')
    expect(endState['todolistId2'][0].status).toBe(TaskStatuses.New)
});

test('status of specified task should be changed', () => {
    const action = changeTaskStatusAC('2', 'todolistId2', TaskStatuses.New);
    const endState = tasksReducer(startState, action);

    expect(endState['todolistId2'][1].status).toBeFalsy()
    expect(endState['todolistId1'][1].status).toBeTruthy()
});

test('title of specified task should be changed', () => {
    const action = changeTaskTitleAC('2', 'todolistId2', 'cake');
    const endState = tasksReducer(startState, action);

    expect(endState['todolistId2'][1].title).toBe('cake')
    expect(endState['todolistId1'][1].title).toBe('JS')
});

test('new property with new array should be added when new todolist is added', () => {
    const action = addTodolistAC('title no matter');
    const endState = tasksReducer(startState, action);

    const keys = Object.keys(endState);
    const newKey = keys.find(k => k !== 'todolistId1' && k !== 'todolistId2');
    if(!newKey) {
        throw Error('new key should be added')
    };

    expect(keys.length).toBe(3);
    expect(endState[newKey]).toEqual([])
});

test('property with todolistId should be deleted', () => {
    const action = removeTodolistAC('todolistId2');
    const endState = tasksReducer(startState, action);

    const keys = Object.keys(endState);

    expect(keys.length).toBe(1);
    expect(endState['todolistId2']).toBeUndefined();
});