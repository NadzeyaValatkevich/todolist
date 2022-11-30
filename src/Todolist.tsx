import React, {ChangeEvent} from "react";
import {FilterValuesType} from "./AppWithRedux";
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import {Button, Checkbox, IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {useDispatch, useSelector} from "react-redux";
import {AppRootState} from "./state/store";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./state/tasks-reducer";

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type PropsType = {
    id: string
    title: string
    changeFilter: (values: FilterValuesType, todolistId: string) => void
    changeTodolistTitle: (newTitle: string, todolistId: string) => void
    removeTodolist: (todolistId: string) => void
    filter: FilterValuesType
}

export const Todolist = (props: PropsType) => {
    const dispatch = useDispatch();
    const tasks = useSelector<AppRootState, TaskType[]>(state => state.tasks[props.id]);

    const onAllClickHandler = () => props.changeFilter('all', props.id)
    const onActiveClickHandler = () => props.changeFilter('active', props.id)
    const onCompletedClickHandler = () => props.changeFilter('completed', props.id)

    const removeTodolist = () => {
        props.removeTodolist(props.id)
    }

     const onChangeTodolistTitle = (newTitle: string) => {
        props.changeTodolistTitle(newTitle, props.id)
     }

    let tasksForTodolist = tasks;
    if (props.filter === 'completed') {
        tasksForTodolist = tasksForTodolist.filter(t => t.isDone)
    }
    if (props.filter === 'active') {
        tasksForTodolist = tasksForTodolist.filter(t => !t.isDone)
    }

    return (
        <div>
            <h3>
                <EditableSpan title={props.title} onChange={onChangeTodolistTitle}/>
                <IconButton aria-label="delete" onClick={removeTodolist}>
                    <Delete />
                </IconButton>
            </h3>
            <AddItemForm addItem={(title: string) => {
                dispatch(addTaskAC(title, props.id))
            }}/>
            <div>
                {tasksForTodolist.map(t => {
                    const onRemoveHandler = () => dispatch(removeTaskAC(t.id, props.id))
                    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
                        dispatch(changeTaskStatusAC(t.id, props.id, e.currentTarget.checked))
                    }
                    const onChangeTitleHandler = (newTitle: string) => {
                        dispatch(changeTaskTitleAC(t.id, props.id, newTitle))
                    }

                    return <div key={t.id} className={t.isDone ? 'is-done' : ''}>
                        <Checkbox
                               checked={t.isDone}
                               onChange={onChangeHandler}/>
                        <EditableSpan title={t.title} onChange={onChangeTitleHandler}/>
                        <IconButton aria-label="delete" onClick={onRemoveHandler}>
                            <Delete />
                        </IconButton>
                    </div>
                })}
            </div>
            <div>
                <Button variant={props.filter === 'all' ? 'contained' : 'text'}
                        onClick={onAllClickHandler} color={'inherit'}>All
                </Button>
                <Button variant={props.filter === 'active' ? 'contained' : 'text'}
                        onClick={onActiveClickHandler} color={'primary'}>Active
                </Button>
                <Button variant={props.filter === 'completed' ? 'contained' : 'text'}
                        onClick={onCompletedClickHandler} color={'secondary'}>Completed
                </Button>
            </div>
        </div>
    )
}