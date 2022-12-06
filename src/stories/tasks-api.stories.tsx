import React, {useEffect, useState} from "react";
import {todolistsApi} from "../api/todolists-api";

export default {
    title: 'API'
};

export const GetTasks = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = '6bdcfa3a-3361-42e6-bba0-10fd45aa2f84'
        todolistsApi.getTasks(todolistId)
            .then(res => {
                setState(res.data)
            })
    }, [])
    return <div>{JSON.stringify(state)}</div>
};

export const DeleteTask = () => {
    const [state, setState] = useState<any>(null);
    const [todolistId, setTodolistId] = useState("");
    const [taskId, setTaskId] = useState("");

    const deleteTask = () => {
        todolistsApi.deleteTask(todolistId, taskId)
            .then(res => {
                setState(res.data)
            })
    };

    return <div>{JSON.stringify(state)}
        <div>
            <input placeholder={'todolistId'}
                   value={todolistId}
                   onChange={e => setTodolistId(e.currentTarget.value)}
            />
            <input placeholder={'taskId'}
                   value={taskId}
                   onChange={e => setTaskId(e.currentTarget.value)}
            />
            <button onClick={deleteTask}>delete task</button>
        </div>
    </div>
};

export const CreateTask = () => {
    const [state, setState] = useState<any>(null);
    const [todolistId, setTodolistId] = useState("");
    const [title, setTitle] = useState("");

    const createTask = () => {
        todolistsApi.createTask(todolistId, title)
            .then(res => {
                setState(res.data)
            })
    };

    return <div>{JSON.stringify(state)}
        <div>
            <input placeholder={'todolistId'}
                   value={todolistId}
                   onChange={e => setTodolistId(e.currentTarget.value)}
            />
            <input placeholder={'title'}
                   value={title}
                   onChange={e => setTitle(e.currentTarget.value)}
            />
            <button onClick={createTask}>Create task</button>
        </div>
    </div>
};

// export const updateTaskTitle = () => {
//     const [state, setState] = useState<any>(null);
//     const [todolistId, setTodolistId] = useState("");
//     const [title, setTitle] = useState("");
//
//     const createTask = () => {
//         todolistsApi.updateTaskTitle(todolistId, title)
//             .then(res => {
//                 setState(res.data)
//             })
//     };
//
//     return <div>{JSON.stringify(state)}
//         <div>
//             <input placeholder={'todolistId'}
//                    value={todolistId}
//                    onChange={e => setTodolistId(e.currentTarget.value)}
//             />
//             <input placeholder={'title'}
//                    value={title}
//                    onChange={e => setTitle(e.currentTarget.value)}
//             />
//             <button onClick={createTask}>Update task title</button>
//         </div>
//     </div>
// };