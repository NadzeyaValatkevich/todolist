import React, {useCallback, useEffect} from 'react';
import '../App.css';
import {
    AppBar,
    Button,
    CircularProgress,
    Container,
    IconButton,
    LinearProgress,
    Toolbar,
    Typography
} from "@mui/material";
import {Menu} from "@mui/icons-material";
import {TaskType} from "../api/todolists-api";
import {TodoListsList} from "../features/TodolistsList/TodolistsList";
import {ErrorSnackBar} from "../components/ErrorSnackBar/ErrorSnackBar";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./store";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Login} from "../features/Login/Login";
import {initializeAppTC} from "./app-reducer";
import {logoutTC} from "../features/Login/auth-reducer";

export type TasksStateType = {
    [key: string]: TaskType[]
};
type AppPropsType = {
    demo?: boolean
};

export const App = ({demo = false}: AppPropsType) => {
    const status = useSelector<AppRootStateType, 'idle' | 'loading' | 'succeeded' | 'failed'>(state => state.app.status);
    const isInitialized = useSelector<AppRootStateType, boolean>(state => state.app.isInitialized);
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch<any>(initializeAppTC())
    }, []);

    const logoutHandler = useCallback(() => {
        dispatch<any>(logoutTC())
    }, []);

    if(!isInitialized) {
        return <div
            style = {{position: 'fixed', top: '50%', textAlign: 'center', width: '100%'}}
        >
            <CircularProgress/>
        </div>
    };

    return (
        <BrowserRouter>
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
                        {isLoggedIn && <Button color="inherit" onClick={logoutHandler}>Log out</Button>}
                    </Toolbar>
                    {status === 'loading' && <LinearProgress/>}
                </AppBar>
                <Container>
                    <Routes>
                        <Route path={'/'} element={<TodoListsList demo={demo}/>}/>
                        <Route path={'/login'} element={<Login/>}/>
                    </Routes>

                </Container>
                <ErrorSnackBar/>
            </div>
        </BrowserRouter>
    )
};
