import React from 'react';
import '../App.css';
import {AppBar, Button, Container, IconButton, Toolbar, Typography} from "@mui/material";
import {Menu} from "@mui/icons-material";
import {TaskType} from "../api/todolists-api";
import {TodoListsList} from "../features/TodolistsList/TodolistsList";

export type TasksStateType = {
    [key: string]: TaskType[]
};

export const App = () => {

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
                <TodoListsList/>
            </Container>
        </div>
    )
};
