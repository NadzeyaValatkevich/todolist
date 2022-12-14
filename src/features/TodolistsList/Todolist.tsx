import React, {useCallback, useEffect} from "react";
import {AddItemForm} from "../../components/AddItemForm/AddItemForm";
import {EditableSpan} from "../../components/EditableSpan/EditableSpan";
import {Button, IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../../app/store";
import {addTaskAC, addTaskTC, fetchTasksTC} from "./tasks-reducer";
import {Task} from './Todolist/Task/Task'
import {TaskStatuses, TaskType} from "../../api/todolists-api";
import {FilterValuesType} from "./todolists-reducer";

type PropsType = {
    id: string
    title: string
    changeFilter: (values: FilterValuesType, todoListId: string) => void
    changeTodoListTitle: (newTitle: string, todoListId: string) => void
    removeTodoList: (todoListId: string) => void
    filter: FilterValuesType
}

export const TodoList = React.memo((props: PropsType) => {

    const dispatch = useDispatch();
    const tasks = useSelector<AppRootStateType, TaskType[]>(state => state.tasks[props.id]);

    useEffect(() => {
        dispatch<any>(fetchTasksTC(props.id))
    }, []);

    const onAllClickHandler = useCallback(() => props.changeFilter('all', props.id), [props.changeFilter, props.id])
    const onActiveClickHandler = useCallback(() => props.changeFilter('active', props.id), [props.changeFilter, props.id])
    const onCompletedClickHandler = useCallback(() => props.changeFilter('completed', props.id), [props.changeFilter, props.id])

    const removeTodoList = () => {
        props.removeTodoList(props.id)
    }

    const onChangeTodoListTitle = useCallback((newTitle: string) => {
        props.changeTodoListTitle(props.id, newTitle)
    }, [props.changeTodoListTitle, props.id])

    const addTask = useCallback((title: string) => {
        dispatch<any>(addTaskTC(props.id, title))
    }, [props.id])

    let tasksForTodoList = tasks;
    if (props.filter === 'completed') {
        tasksForTodoList = tasksForTodoList.filter(t => t.status === TaskStatuses.New)
    }
    if (props.filter === 'active') {
        tasksForTodoList = tasksForTodoList.filter(t => t.status === TaskStatuses.Completed)
    }

    return (
        <div>
            <h3>
                <EditableSpan title={props.title} onChange={onChangeTodoListTitle}/>
                <IconButton aria-label="delete" onClick={removeTodoList}>
                    <Delete/>
                </IconButton>
            </h3>
            <AddItemForm addItem={addTask}/>
            <div>
                {tasksForTodoList.map(t => <Task
                    key={t.id}
                    task={t}
                    todoListId={props.id}
                />)}
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
})