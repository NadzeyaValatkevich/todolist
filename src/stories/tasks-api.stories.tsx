import React, {useEffect, useState} from "react";
import {todolistsApi} from "../api/todolists-api";

export default {
    title: 'API'
};

export const GetTasks = () => {
    const [state, setState] = useState<any>(null);
    const [todolistId, setTodolistId] = useState("");

    const getTasks = () => {
        todolistsApi.getTasks(todolistId)
            .then(res => {
                setState(res.data)
            })
    }
    return <div>{JSON.stringify(state)}
        <div>
            <input placeholder={'todolistId'}
                   value={todolistId}
                   onChange={e => setTodolistId(e.currentTarget.value)}
            />
            <button onClick={getTasks}>get task</button>
        </div>

    </div>
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

export const UpdateTaskTitle = () => {
    const [state, setState] = useState<any>(null);
    const [todolistId, setTodolistId] = useState("");
    const [taskId, setTaskId] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState(0);
    const [priority, setPriority] = useState(0);
    const [startDate, setStartDate] = useState("");
    const [deadline, setDeadline] = useState("");

    const createTask = () => {
        todolistsApi.updateTaskTitle(todolistId, taskId, {
            title: title,
            description: description,
            status:status,
            priority: priority,
            startDate: startDate,
            deadline: deadline
        })
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
            /><input placeholder={'title'}
                   value={title}
                   onChange={e => setTitle(e.currentTarget.value)}
            /><input placeholder={'description'}
                   value={description}
                   onChange={e => setDescription(e.currentTarget.value)}
            /><input placeholder={'status'}
                   value={status}
                   onChange={e => setStatus(+e.currentTarget.value)}
            /><input placeholder={'priority'}
                   value={priority}
                   onChange={e => setPriority(+e.currentTarget.value)}
            /><input placeholder={'startDate'}
                   value={startDate}
                   onChange={e => setStartDate(e.currentTarget.value)}
            /><input placeholder={'deadline'}
                   value={deadline}
                   onChange={e => setDeadline(e.currentTarget.value)}
            />
            <button onClick={createTask}>Update task title</button>
        </div>
    </div>
};