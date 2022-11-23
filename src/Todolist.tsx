import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {FilterValuesType} from "./App";
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type PropsType = {
    id: string
    title: string
    tasks: TaskType[]
    removeTask: (id: string, todolistId: string) => void
    changeFilter: (values: FilterValuesType, todolistId: string) => void
    addTask: (title: string, todolistId: string) => void
    changeTaskStatus: (taskId: string, isDone: boolean, todolistId: string) => void
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
    changeTodolistTitle: (newTitle: string, todolistId: string) => void
    removeTodolist: (todolistId: string) => void
    filter: FilterValuesType
}

export const Todolist = (props: PropsType) => {
    const onAllClickHandler = () => props.changeFilter('all', props.id)
    const onActiveClickHandler = () => props.changeFilter('active', props.id)
    const onCompletedClickHandler = () => props.changeFilter('completed', props.id)

    const removeTodolist = () => {
        props.removeTodolist(props.id)
    }

    const addTask = (title: string) => {
        props.addTask(title, props.id)
    }
     const onChangeTodolistTitle = (newTitle: string) => {
        props.changeTodolistTitle(newTitle, props.id)
     }

    return (
        <div>
            <h3>
                <EditableSpan title={props.title} onChange={onChangeTodolistTitle}/>
                <button onClick={removeTodolist}>X</button>
            </h3>
            <AddItemForm addItem={addTask}/>
            <ul>
                {props.tasks.map(t => {
                    const onRemoveHandler = () => props.removeTask(t.id, props.id)
                    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
                        props.changeTaskStatus(t.id, e.currentTarget.checked, props.id)
                    }
                    const onChangeTitleHandler = (newTitle: string) => {
                        props.changeTaskTitle(t.id, newTitle, props.id)
                    }

                    return <li key={t.id} className={t.isDone ? 'is-done' : ''}>
                        <input type={'checkbox'}
                               checked={t.isDone}
                               onChange={onChangeHandler}/>
                        <EditableSpan title={t.title} onChange={onChangeTitleHandler}/>
                        <button onClick={onRemoveHandler}>X
                        </button>
                    </li>
                })}
            </ul>
            <div>
                <button className={props.filter === 'all' ? 'active-filter' : ''}
                        onClick={onAllClickHandler}>All
                </button>
                <button className={props.filter === 'active' ? 'active-filter' : ''}
                        onClick={onActiveClickHandler}>Active
                </button>
                <button className={props.filter === 'completed' ? 'active-filter' : ''}
                        onClick={onCompletedClickHandler}>Completed
                </button>
            </div>
        </div>
    )
}