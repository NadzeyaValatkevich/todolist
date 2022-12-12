import React, {useCallback, useEffect} from 'react';
import './App.css';
import {AddItemForm} from "./AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@mui/material";
import {Menu} from "@mui/icons-material";
import {
    createTodoListTC,
    changeTodoListFilterAC,
    changeTodoListTitleAC, fetchTodoListsTC, FilterValuesType,
    removeTodoListTC, TodoListDomainType, changeTodoListTitleTC,
} from "./state/todolists-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";
import {TaskType} from "./api/todolists-api";
import {TodoList} from "./Todolist";

export type TasksStateType = {
    [key: string]: TaskType[]
};

export const AppWithRedux = () => {

    const dispatch = useDispatch();
    const todoLists = useSelector<AppRootStateType, TodoListDomainType[]>(state => state.todoLists);

    useEffect(() => {
        dispatch<any>(fetchTodoListsTC())
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
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{mr: 2}}
                    >
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <Container>
                <Grid container style={{padding: '10px'}}>
                    <AddItemForm addItem={addTodoList}/>
                </Grid>
                <Grid container spacing={3}>
                    {todoLists.map(tl => {

                        return <Grid item>
                            <Paper style={{padding: '10px'}}>
                                <TodoList
                                    key={tl.id}
                                    id={tl.id}
                                    title={tl.title}
                                    changeFilter={changeFilter}
                                    changeTodoListTitle={changeTodoListTitle}
                                    removeTodoList={removeTodoList}
                                    filter={tl.filter}
                                />
                            </Paper>
                        </Grid>
                    })}
                </Grid>
            </Container>
        </div>
    )
};


