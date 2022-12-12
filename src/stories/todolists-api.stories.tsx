import React, {useEffect, useState} from 'react'
import {todoListsApi} from "../api/todolists-api";

export default {
    title: 'API'
};

export const GetTodoLists = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todoListsApi.getTodoLists()
            .then(res => {
                setState(res.data)
            })
    }, [])
    return <div>{JSON.stringify(state)}</div>
};
export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null);
    const [title, setTitle] = useState("");

    const createTodoList = () => {
        todoListsApi.createTodoLists(title)
            .then(res => {
                setState(res.data)
            })
    };

    return <div>{JSON.stringify(state)}
        <div>
            <input value={title}
                   placeholder={"todolist's title"}
                   onChange={e => setTitle(e.currentTarget.value)}
            />
            <button onClick={createTodoList}>Create todolist</button>
        </div>
    </div>
};

export const DeleteTodoList = () => {
    const [state, setState] = useState<any>(null);
    const [todoListId, setTodoListId] = useState("");

    const deleteTodoList = () => {
        todoListsApi.deleteTodoList(todoListId)
            .then(res => {
                setState(res.data)
            })
    };

    return <div>{JSON.stringify(state)}
        <div>
            <input value={todoListId}
                   placeholder={'todolistId'}
                   onChange={e => setTodoListId(e.currentTarget.value)}/>
            <button onClick={deleteTodoList}>Delete todoList</button>
        </div>
    </div>
};
export const UpdateTodoListTitle = () => {
    const [state, setState] = useState<any>(null);
    const [todoListId, setTodoListId] = useState("");
    const [title, setTitle] = useState("");

    const updateTodoListTitle = () => {
        todoListsApi.updateTodoListTitle(todoListId, title)
            .then(res => {
                setState(res.data)
            })
    };

    return <div>{JSON.stringify(state)}
        <div>
            <input value={todoListId}
                   placeholder={'todolistId'}
                   onChange={e => setTodoListId(e.currentTarget.value)}
            />
            <input value={title}
                   placeholder={"todolists's title"}
                   onChange={e => setTitle(e.currentTarget.value)}
            />
            <button onClick={updateTodoListTitle}>Update title</button>
        </div>
    </div>
}