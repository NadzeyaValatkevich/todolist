import React, {useCallback, useEffect} from "react";
import {useSelector} from "react-redux";
import {TodoListDomainType} from "./todoLists-reducer";
import {Grid} from "@mui/material";
import {AddItemForm, AddItemFormSubmitHelperType} from "../../components/AddItemForm/AddItemForm";
import {TodoList} from "./Todolist";
import {Navigate} from "react-router-dom";
import {selectIsLoggedIn} from "../Auth/selectors";
import {todoListsActions} from "./index";
import {AppRootStateType} from "../../utils/types";
import {useActions, useAppDispatch} from "../../utils/redux-utils";

type TodoListsListPropsType = {
    demo?: boolean
};

export const TodoListsList: React.FC<TodoListsListPropsType> = ({demo = false}) => {
    const todoLists = useSelector<AppRootStateType, TodoListDomainType[]>(state => state.todoLists);
    const isLoggedIn = useSelector(selectIsLoggedIn);
    const {fetchTodoLists} = useActions(todoListsActions);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if(!demo || isLoggedIn) {fetchTodoLists()}
    }, []);

    const addTodoListCallback = useCallback(async (title: string, helper: AddItemFormSubmitHelperType) => {
        const thunk = todoListsActions.createTodoList(title)
        const resultAction = await dispatch(thunk);

        if (todoListsActions.createTodoList.rejected.match(resultAction)) {
            if (resultAction.payload?.errors?.length) {
                const errorMessage = resultAction.payload?.errors[0];
                helper.setError(errorMessage)
            } else {
                helper.setError('Some error occured')
            }
        } else {
            helper.setTitle('')
        }
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