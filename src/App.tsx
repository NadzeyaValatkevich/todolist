import React, {useState} from 'react';
import './App.css';
import {TaskType, Todolist} from "./Todolist";
import {v1} from "uuid";

export type FilterValuesType = 'all' | 'completed' | 'active'

export const App = () => {

    const [tasks, setTasks] = useState<TaskType[]>([
        {id: v1(), title: 'HTML&CSS', isDone: true},
        {id: v1(), title: 'JS', isDone: true},
        {id: v1(), title: 'React', isDone: false}
    ]);

    const [filter, setFilter] = useState<FilterValuesType>('all');

    const changeFilter = (value: FilterValuesType) => {
        setFilter(value)
    }

    const removeTask = (id: string) => {
        const filteredTasks = tasks.filter(t => t.id !== id)
        setTasks(filteredTasks)
    }

    const addTask = (title: string) => {
        const newTask = {id: v1(), title: title, isDone: false}
        const newTasks = [newTask, ...tasks]
        setTasks(newTasks)
    }

    const changeStatus = (taskId: string, isDone: boolean) => {
        const task = tasks.find( t => t.id === taskId)
        task && ( task.isDone = isDone )
        setTasks([...tasks])
    }

    let tasksForTododlist = tasks;
    if (filter === 'completed') {
        tasksForTododlist = tasks.filter(t => t.isDone)
    }
    if (filter === 'active') {
        tasksForTododlist = tasks.filter(t => !t.isDone)
    }

    return (
        <div className="App">
            <Todolist title={'What to learn'}
                      tasks={tasksForTododlist}
                      removeTask={removeTask}
                      changeFilter={changeFilter}
                      addTask={addTask}
                      changeTaskStatus={changeStatus}
                      filter={filter}
            />
        </div>
    )
};


