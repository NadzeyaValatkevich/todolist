import {TasksStateType} from "../AppWithRedux";
import {TaskPriorities, TaskStatuses} from "../api/todolists-api";
import {removeTaskAC, tasksReducer} from "./tasks-reducer";

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
