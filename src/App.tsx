import React, {useState} from 'react';
import './App.css';
import {TaskType, Todolist} from "./Todolist";
import {v1} from "uuid";
import {AddItemForm} from "./AddItemForm";

export type FilterValuesType = 'all' | 'completed' | 'active'
export type TodolistType = {
    id: string,
    title: string,
    filter: FilterValuesType
}

export type TasksStateType = {
    [key: string]: TaskType[]
}

export const App = () => {

    const todolistId1 = v1()
    const todolistId2 = v1()

    const [tasks, setTasks] = useState<TasksStateType>({
        [todolistId1]: [
            {id: v1(), title: 'HTML&CSS', isDone: true},
            {id: v1(), title: 'JS', isDone: true},
            {id: v1(), title: 'React', isDone: false},
            {id: v1(), title: 'Redux', isDone: false},
        ],
        [todolistId2]: [
            {id: v1(), title: 'milk', isDone: true},
            {id: v1(), title: 'bread', isDone: true},
            {id: v1(), title: 'butter', isDone: false},
        ],
    })

    const [todolists, setTodolists] = useState<TodolistType[]>([
        {id: todolistId1, title: 'What to learn', filter: 'all'},
        {id: todolistId2, title: 'What to buy', filter: 'all'},
    ])

    const changeFilter = (value: FilterValuesType, todolistId: string) => {
        let todolist = todolists.find(tl => tl.id === todolistId)
        if (todolist) {
            todolist.filter = value
        }
        setTodolists([...todolists])
    }

    const removeTask = (id: string, todolistId: string) => {
        const newTasks = tasks[todolistId]
        const filteredTasks = newTasks.filter(t => t.id !== id)
        tasks[todolistId] = filteredTasks
        setTasks({...tasks})
    }

    const addTask = (title: string, todolistId: string) => {
        const newTask = {id: v1(), title: title, isDone: false}
        const newTasks = tasks[todolistId]
        const newTasksObj = [newTask, ...newTasks]
        tasks[todolistId] = newTasksObj
        setTasks({...tasks})
    }

    const changeStatus = (taskId: string, isDone: boolean, todolistId: string) => {
        const newTasks = tasks[todolistId]
        const task = newTasks.find(t => t.id === taskId)
        if (task) {
            task.isDone = isDone;
            setTasks({...tasks})
        }
    }

    const removeTodolist = (todolistId: string) => {
        const filteredTodolists = todolists.filter(tl => tl.id !== todolistId)
        setTodolists(filteredTodolists)
        delete tasks[todolistId]
        setTasks({...tasks})
    }

    const addTodolist = (title: string) => {
        const todolist: TodolistType = {id: v1(), title, filter: 'all'}
        setTodolists([todolist, ...todolists])
        setTasks({
            ...tasks,
            [todolist.id]: []
        })
    }

    const changeTaskTitle = (taskId: string, newTitle: string, todolistId: string) => {
        const newTasks = {
            ...tasks, [todolistId]: tasks[todolistId].map((elem) => elem.id === taskId ? {...elem, title: newTitle} : elem)
        }
        setTasks(newTasks)
    }

    const changeTodolistTitle = (newTitle: string, todolistId: string) => {
        setTodolists(todolists.map(elem => elem.id === todolistId ? {...elem, title: newTitle} : elem))
    }

    return (
        <div className="App">
            <AddItemForm addItem={addTodolist}/>
            {todolists.map(tl => {

                let tasksForTodolist = tasks[tl.id];
                if (tl.filter === 'completed') {
                    tasksForTodolist = tasksForTodolist.filter(t => t.isDone)
                }
                if (tl.filter === 'active') {
                    tasksForTodolist = tasksForTodolist.filter(t => !t.isDone)
                }

                return <Todolist
                    key={tl.id}
                    id={tl.id}
                    title={tl.title}
                    tasks={tasksForTodolist}
                    removeTask={removeTask}
                    changeFilter={changeFilter}
                    addTask={addTask}
                    changeTaskStatus={changeStatus}
                    changeTaskTitle={changeTaskTitle}
                    changeTodolistTitle={changeTodolistTitle}
                    removeTodolist={removeTodolist}
                    filter={tl.filter}
                />
            })}
        </div>
    )
};


