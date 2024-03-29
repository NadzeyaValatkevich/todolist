import React, {useCallback, useEffect} from "react";
import {AddItemForm, AddItemFormSubmitHelperType} from "../../components/AddItemForm/AddItemForm";
import {EditableSpan} from "../../components/EditableSpan/EditableSpan";
import {Button, IconButton, Paper} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {useSelector} from "react-redux";

import {Task} from './Todolist/Task/Task'

import {FilterValuesType, TodoListDomainType} from "./todoLists-reducer";
import {tasksActions, todoListsActions} from "./index";
import {AppRootStateType} from "../../utils/types";
import {TaskStatuses, TaskType} from "../../api/types";
import {useActions, useAppDispatch} from "../../utils/redux-utils";


type PropsType = {
    todoList: TodoListDomainType
    demo?: boolean
};

export const TodoList = React.memo(({demo = false, ...props}: PropsType) => {

    const tasks = useSelector<AppRootStateType, TaskType[]>(state => state.tasks[props.todoList.id]);
    const {fetchTasks} = useActions(tasksActions)
    const {changeTodoListFilter, removeTodoList, changeTodoListTitle} = useActions(todoListsActions)

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!demo) {
            fetchTasks(props.todoList.id)
        }
    }, []);

    const onFilterButtonClickHandler = useCallback((filter: FilterValuesType) => changeTodoListFilter({
        todoListId: props.todoList.id,
        filter,
    }), [props.todoList.id]);

    const removeTodoListHandler = () => {
        removeTodoList(props.todoList.id)
    };

    const onChangeTodoListTitle = useCallback((newTitle: string) => {
        changeTodoListTitle({title: newTitle, todoListId: props.todoList.id})
    }, [props.todoList.id])

    const addTaskCallback = useCallback(async (title: string, helper: AddItemFormSubmitHelperType) => {
        const thunk = tasksActions.addTask({todoListId: props.todoList.id, title})
        const resultAction = await dispatch(thunk);

        if (tasksActions.addTask.rejected.match(resultAction)) {
            if (resultAction.payload?.errors?.length) {
                const errorMessage = resultAction.payload?.errors[0];
                helper.setError(errorMessage)
            } else {
                helper.setError('Some error occured')
            }
        } else {
            helper.setTitle('')
        }
    }, [props.todoList.id]);

    let tasksForTodoList = tasks;
    if (props.todoList.filter === 'completed') {
        tasksForTodoList = tasksForTodoList.filter(t => t.status === TaskStatuses.New)
    }
    if (props.todoList.filter === 'active') {
        tasksForTodoList = tasksForTodoList.filter(t => t.status === TaskStatuses.Completed)
    }
    ;

    const onAllClickHandler = useCallback(() => changeTodoListFilter({
        todoListId: props.todoList.id,
        filter: 'all'
    }), [changeTodoListFilter, props.todoList.id])
    const onActiveClickHandler = useCallback(() => changeTodoListFilter({
        todoListId: props.todoList.id,
        filter: 'active'
    }), [changeTodoListFilter, props.todoList.id])
    const onCompletedClickHandler = useCallback(() => changeTodoListFilter({
        todoListId: props.todoList.id,
        filter: 'completed'
    }), [changeTodoListFilter, props.todoList.id])

    // const renderFilterButton = (buttonFilter: FilterValuesType,
    //                             color:  any,
    //                             text: string) => {
    //     return <Button variant={props.todoList.filter === buttonFilter ? 'outlined' : 'text'}
    //                    onClick={() => onFilterButtonClickHandler(buttonFilter)}
    //                    color={color}>{text}</Button>
    // };

    return (
        <Paper style={{padding: '10px', position: 'relative'}}>
            <IconButton aria-label="delete"
                        onClick={removeTodoListHandler}
                        disabled={props.todoList.entityStatus === 'loading'}
                        size={'small'}
                        style={{position: 'absolute', right: '5px', top: '5px'}}
            >
                <Delete fontSize={'small'}/>
            </IconButton>
            <h3>
                <EditableSpan title={props.todoList.title} onChange={onChangeTodoListTitle}/>
            </h3>
            <AddItemForm addItem={addTaskCallback}
                         disabled={props.todoList.entityStatus === 'loading'}
            />
            <div>
                {tasksForTodoList.map(t => <Task
                    key={t.id}
                    task={t}
                    todoListId={props.todoList.id}
                />)}
                {!tasksForTodoList.length && <div style={{padding: '10px', color: 'gray'}}>No tasks</div>}
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
                {/*{renderFilterButton('all', 'default', 'All')}*/}
                {/*{renderFilterButton('active', 'primary', 'Active')}*/}
                {/*{renderFilterButton('completed', 'secondary', 'Completed')}*/}
            </div>
        </Paper>
    )
})