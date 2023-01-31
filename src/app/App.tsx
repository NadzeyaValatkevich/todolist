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
import {TodoListsList} from "../features/TodolistsList";
import {ErrorSnackBar} from "../components/ErrorSnackBar/ErrorSnackBar";
import {useDispatch, useSelector} from "react-redux";
import {Route, Routes} from "react-router-dom";
import {Login} from "../features/Auth";
import {authActions} from "../features/Auth";
import {asyncActions} from "../features/Application/application-reducer";
import {selectIsInitialized, selectStatus} from "../features/Application/selectors";
import {authSelectors} from "../features/Auth";
import {TaskType} from "../api/types";
import {useActions} from "../utils/redux-utils";
import {appActions} from "../features/Application";

export type TasksStateType = {
    [key: string]: TaskType[]
};
type AppPropsType = {
    demo?: boolean
};

export const App = ({demo = false}: AppPropsType) => {

    const status = useSelector(selectStatus);
    const isInitialized = useSelector(selectIsInitialized);
    const isLoggedIn = useSelector(authSelectors.selectIsLoggedIn);

    const {logout} = useActions(authActions);
    const {initializeApp} = useActions(appActions);

    useEffect(() => {initializeApp()}, []);

    const logoutHandler = useCallback(() => {logout()}, []);

    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '50%', textAlign: 'center', width: '100%'}}
        >
            <CircularProgress/>
        </div>
    };
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
    )
};
