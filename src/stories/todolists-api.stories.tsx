import React, {useEffect, useState} from 'react'
import {todolistsApi} from "../api/todolists-api";

export default {
    title: 'API'
};

export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistsApi.getTodolists()
            .then(res => {
                setState(res.data)
            })
    }, [])
    return <div>{JSON.stringify(state)}</div>
};
export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null);
    const [title, setTitle] = useState("");

    const createTodolist = () => {
        todolistsApi.createTodolists(title)
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
            <button onClick={createTodolist}>Create todolist</button>
        </div>
    </div>
};

export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null);
    const [todolistId, setTodolistId] = useState("");

    const deleteTodolist = () => {
        todolistsApi.deleteTodolists(todolistId)
            .then(res => {
                setState(res.data)
            })
    };

    return <div>{JSON.stringify(state)}
        <div>
            <input value={todolistId}
                   placeholder={'todolistId'}
                   onChange={e => setTodolistId(e.currentTarget.value)}/>
            <button onClick={deleteTodolist}>Delete todolist</button>
        </div>
    </div>
};
export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null);
    const [todolistId, setTodolistId] = useState("");
    const [title, setTitle] = useState("");

    const updateTodolistTitle = () => {
        todolistsApi.updateTodolists(todolistId, title)
            .then(res => {
                setState(res.data)
            })
    };

    return <div>{JSON.stringify(state)}
        <div>
            <input value={todolistId}
                   placeholder={'todolistId'}
                   onChange={e => setTodolistId(e.currentTarget.value)}
            />
            <input value={title}
                   placeholder={"todolists's title"}
                   onChange={e => setTitle(e.currentTarget.value)}
            />
            <button onClick={updateTodolistTitle}>Update title</button>
        </div>
    </div>
}