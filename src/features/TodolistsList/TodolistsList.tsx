import React, {useCallback, useEffect} from "react";
import {useSelector} from "react-redux";
import {AppRootStateType, useActions} from "../../app/store";
import {TodoListDomainType} from "./todoLists-reducer";
import {Grid, Paper} from "@mui/material";
import {AddItemForm} from "../../components/AddItemForm/AddItemForm";
import {TodoList} from "./Todolist";
import {Navigate} from "react-router-dom";
import {selectIsLoggedIn} from "../Auth/selectors";
import {todoListsActions} from "./index";

type TodoListsListPropsType = {
    demo?: boolean
};

export const TodoListsList: React.FC<TodoListsListPropsType> = ({demo = false}) => {
    const todoLists = useSelector<AppRootStateType, TodoListDomainType[]>(state => state.todoLists);
    const isLoggedIn = useSelector(selectIsLoggedIn);
    const {createTodoList, fetchTodoLists} = useActions(todoListsActions)

    useEffect(() => {
        if(!demo || isLoggedIn) {fetchTodoLists()}
    }, []);

    const addTodoListCallback = useCallback(async (title: string) => {
        createTodoList(title)
    }, []);

    // const removeTodoListHandler = useCallback((todoListId: string) => {
    //     removeTodoList(todoListId)
    // }, [dispatch]);

    // const addTodoList = useCallback((title: string) => {
    //     createTodoList(title)
    // }, [dispatch]);

    // const changeTodoListTitle = useCallback((todoListId: string, title: string) => {
    //    changeTodoListTitleTC({title, todoListId})
    // }, [dispatch]);

    // const changeFilter = useCallback((filter: FilterValuesType, todoListId: string) => {
    //     changeTodoListFilterAC({todoListId, filter})
    // }, [dispatch]);

    if(!isLoggedIn) {
        return <Navigate to={'/login'}/>
    };

    return (
        <>
            <Grid container style={{padding: '10px'}}>
                <AddItemForm addItem={addTodoListCallback}/>
            </Grid>
            <Grid container spacing={3} style={{flexWrap: 'nowrap', overflowX: 'scroll'}}>
                {todoLists.map(tl => {
                    return <Grid item>
                        <div style={{width: '300px'}}>
                            <TodoList
                                key={tl.id}
                                todoList={tl}
                                demo={demo}
                            />
                        </div>
                    </Grid>
                })}
            </Grid>
        </>
    )
}