import React, {useCallback, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType, useActions} from "../../app/store";
import {
    changeTodoListFilterAC,
    FilterValuesType,
    TodoListDomainType
} from "./todoLists-reducer";
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
    const dispatch = useDispatch();
    const todoLists = useSelector<AppRootStateType, TodoListDomainType[]>(state => state.todoLists);
    const isLoggedIn = useSelector(selectIsLoggedIn);
    const {removeTodoList, createTodoList, fetchTodoLists, changeTodoListTitleTC } = useActions(todoListsActions)

    useEffect(() => {
        if(!demo || isLoggedIn) {fetchTodoLists()}
    }, []);

    const removeTodoListHandler = useCallback((todoListId: string) => {
        removeTodoList(todoListId)
    }, [dispatch]);

    const addTodoList = useCallback((title: string) => {
        createTodoList(title)
    }, [dispatch]);

    const changeTodoListTitle = useCallback((todoListId: string, title: string) => {
       changeTodoListTitleTC({title, todoListId})
    }, [dispatch]);

    const changeFilter = useCallback((filter: FilterValuesType, todoListId: string) => {
        changeTodoListFilterAC({todoListId, filter})
    }, [dispatch]);

    if(!isLoggedIn) {
        return <Navigate to={'/login'}/>
    };

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
                                removeTodoList={removeTodoListHandler}
                                demo={demo}
                            />
                        </Paper>
                    </Grid>
                })}
            </Grid>
        </>
    )
}