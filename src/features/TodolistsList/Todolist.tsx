import React, {useCallback, useEffect} from "react";
import {AddItemForm} from "../../components/AddItemForm/AddItemForm";
import {EditableSpan} from "../../components/EditableSpan/EditableSpan";
import {Button, IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {useSelector} from "react-redux";
import {AppRootStateType, useActions, useAppDispatch} from "../../app/store";
import {Task} from './Todolist/Task/Task'
import {TaskStatuses, TaskType} from "../../api/todolists-api";
import {FilterValuesType, TodoListDomainType} from "./todoLists-reducer";
import {tasksActions} from "./index";

type PropsType = {
    todoList: TodoListDomainType
    changeFilter: (values: FilterValuesType, todoListId: string) => void
    changeTodoListTitle: (newTitle: string, todoListId: string) => void
    removeTodoList: (todoListId: string) => void
    demo?: boolean
}

export const TodoList = React.memo(({demo = false, ...props}: PropsType) => {

    const dispatch = useAppDispatch();
    const tasks = useSelector<AppRootStateType, TaskType[]>(state => state.tasks[props.todoList.id]);
    const {addTaskTC, fetchTasks} = useActions(tasksActions)

    useEffect(() => {
        if(!demo) {fetchTasks(props.todoList.id)}
    }, []);

    const onAllClickHandler = useCallback(() => props.changeFilter('all', props.todoList.id), [props.changeFilter, props.todoList.id])
    const onActiveClickHandler = useCallback(() => props.changeFilter('active', props.todoList.id), [props.changeFilter, props.todoList.id])
    const onCompletedClickHandler = useCallback(() => props.changeFilter('completed', props.todoList.id), [props.changeFilter, props.todoList.id])

    const removeTodoList = () => {
        props.removeTodoList(props.todoList.id)
    }

    const onChangeTodoListTitle = useCallback((newTitle: string) => {
        props.changeTodoListTitle(props.todoList.id, newTitle)
    }, [props.changeTodoListTitle, props.todoList.id])

    const addTask = useCallback((title: string) => {
        addTaskTC({todoListId: props.todoList.id, title})
    }, [props.todoList.id])

    let tasksForTodoList = tasks;
    if (props.todoList.filter === 'completed') {
        tasksForTodoList = tasksForTodoList.filter(t => t.status === TaskStatuses.New)
    }
    if (props.todoList.filter === 'active') {
        tasksForTodoList = tasksForTodoList.filter(t => t.status === TaskStatuses.Completed)
    }

    return (
        <div>
            <h3>
                <EditableSpan title={props.todoList.title} onChange={onChangeTodoListTitle}/>
                <IconButton aria-label="delete"
                            onClick={removeTodoList}
                            disabled={props.todoList.entityStatus === 'loading'}>
                    <Delete/>
                </IconButton>
            </h3>
            <AddItemForm addItem={addTask}
                         disabled={props.todoList.entityStatus === 'loading'}
            />
            <div>
                {tasksForTodoList.map(t => <Task
                    key={t.id}
                    task={t}
                    todoListId={props.todoList.id}
                />)}
            </div>
            <div>
                <Button variant={props.todoList.filter === 'all' ? 'contained' : 'text'}
                        onClick={onAllClickHandler} color={'inherit'}>All
                </Button>
                <Button variant={props.todoList.filter === 'active' ? 'contained' : 'text'}
                        onClick={onActiveClickHandler} color={'primary'}>Active
                </Button>
                <Button variant={props.todoList.filter === 'completed' ? 'contained' : 'text'}
                        onClick={onCompletedClickHandler} color={'secondary'}>Completed
                </Button>
            </div>
        </div>
    )
})