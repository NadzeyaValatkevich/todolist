import React from 'react';
import './App.css';
import {Todolist} from "./Todolist";

export const App = () => {

    const tasks1 = [
        {id: 1, title: 'HTML&CSS', isDone: true},
        {id: 2, title: 'JS', isDone: true},
        {id: 3, title: 'React', isDone: false}
    ]

    const tasks2 = [
        {id: 1, title: 'romantic', isDone: true},
        {id: 2, title: 'comady', isDone: false},
        {id: 3, title: 'triller', isDone: true}
    ]


    return (
        <div className="App">
            <Todolist title={'What to learn'} tasks={tasks1}/>
            <Todolist title={'What to watch'} tasks={tasks2}/>
        </div>
    )
}

