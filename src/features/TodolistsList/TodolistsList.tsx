import React, {useCallback, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../../app/store";
import {
    changeTodoListFilterAC,
    changeTodoListTitleTC,
    createTodoListTC,
    fetchTodoListsTC, FilterValuesType,
    removeTodoListTC,
    TodoListDomainType
} from "./todolists-reducer";
import {Grid, Paper} from "@mui/material";
import {AddItemForm} from "../../components/AddItemForm/AddItemForm";
import {TodoList} from "./Todolist";

type TodoListsListPropstype = {
    demo?: boolean
};

export const TodoListsList: React.FC<TodoListsListPropstype> = ({demo = false}) => {
    const dispatch = useDispatch();
    const todoLists = useSelector<AppRootStateType, TodoListDomainType[]>(state => state.todoLists);

    useEffect(() => {
        if(!demo) {
            dispatch<any>(fetchTodoListsTC())
        }
    }, []);

    const removeTodoList = useCallback((todoListId: string) => {
        dispatch<any>(removeTodoListTC(todoListId))
    }, [dispatch]);

    const addTodoList = useCallback((title: string) => {
        dispatch<any>(createTodoListTC(title))
    }, [dispatch]);

    const changeTodoListTitle = useCallback((todoListId: string, title: string) => {
        dispatch<any>(changeTodoListTitleTC(title, todoListId))
    }, [dispatch]);

    const changeFilter = useCallback((value: FilterValuesType, todoListId: string) => {
        dispatch(changeTodoListFilterAC(todoListId, value))
    }, [dispatch]);
    return (
        <>
            <Grid container style={{padding: '10px'}}>
                <AddItemForm addItem={addTodoList}/>
            </Grid>
            <Grid container spacing={3}>
                {todoLists.map(tl => {
                    return <Grid item>
                        <Paper style={{padding: '10px'}}>
                            <TodoList
                                key={tl.id}
                                todoList={tl}
                                changeFilter={changeFilter}
                                changeTodoListTitle={changeTodoListTitle}
                                removeTodoList={removeTodoList}
                                demo={demo}
                            />
                        </Paper>
                    </Grid>
                })}
            </Grid>
        </>
    )
}