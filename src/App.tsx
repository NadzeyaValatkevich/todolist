import React, {useState} from 'react';
import './App.css';
import {TaskType, Todolist} from "./Todolist";

export type FilterValuesType = 'all' | 'completed' | 'active'

export const App = () => {

    const [tasks, setTasks] = useState<TaskType[]>([
        {id: 1, title: 'HTML&CSS', isDone: true},
        {id: 2, title: 'JS', isDone: true},
        {id: 3, title: 'React', isDone: false}
    ]);

    const [filter, setFilter] = useState<FilterValuesType>('all');

    const changeFilter = (value: FilterValuesType) => {
        setFilter(value)
    }

    let tasksForTododlist = tasks;
    if(filter === 'completed') {
        tasksForTododlist = tasks.filter(t => t.isDone)
    };
    if(filter === 'active') {
        tasksForTododlist = tasks.filter(t => !t.isDone)
    }


    const removeTask = (id: number) => {
        const filteredTasks = tasks.filter( t => t.id !== id)
        setTasks(filteredTasks)
    }

    return (
        <div className="App">
            <Todolist title={'What to learn'}
                      tasks={tasksForTododlist}
                      removeTask={removeTask}
                      changeFilter={changeFilter}/>
        </div>
    )
};


