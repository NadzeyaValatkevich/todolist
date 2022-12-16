import React from 'react';
import '../App.css';
import {AppBar, Button, Container, IconButton, LinearProgress, Toolbar, Typography} from "@mui/material";
import {Menu} from "@mui/icons-material";
import {TaskType} from "../api/todolists-api";
import {TodoListsList} from "../features/TodolistsList/TodolistsList";
import {ErrorSnackBar} from "../components/ErrorSnackBar/ErrorSnackBar";
import {useSelector} from "react-redux";
import {AppRootStateType} from "./store";

export type TasksStateType = {
    [key: string]: TaskType[]
};

export const App = () => {
    const status = useSelector<AppRootStateType, 'idle' | 'loading' | 'succeeded' | 'failed'>(state => state.app.status)

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
                { status === 'loading' && <LinearProgress />}
            </AppBar>
            <Container>
                <TodoListsList/>
            </Container>
            <ErrorSnackBar/>
        </div>
    )
};
