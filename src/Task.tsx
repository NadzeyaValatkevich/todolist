import {
    removeTaskTC,
    updateTaskTC
} from "./state/tasks-reducer";
import React, {ChangeEvent, useCallback} from "react";
import {Checkbox, IconButton} from "@mui/material";
import {EditableSpan} from "./EditableSpan";
import {Delete} from "@mui/icons-material";
import {useDispatch} from "react-redux";
import {TaskStatuses, TaskType} from "./api/todolists-api";

type TaskPropsType = {
    task: TaskType
    todoListId: string
};

export const Task = React.memo((props: TaskPropsType) => {
    const dispatch = useDispatch()
    const onRemoveTaskHandler = () => dispatch<any>(removeTaskTC(props.todoListId, props.task.id))
    const onChangeStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
        dispatch<any>(updateTaskTC(
            props.todoListId,
            props.task.id,
            {status: e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New}))
    }
    const onChangeTitleHandler = useCallback((newTitle: string) => {
        dispatch<any>(updateTaskTC(props.todoListId, props.task.id, {title:newTitle}))
    }, [props.task.id, props.todoListId, updateTaskTC])

    return <div key={props.task.id} className={props.task.status === TaskStatuses.Completed ? 'is-done' : ''}>
        <Checkbox
            checked={props.task.status === TaskStatuses.Completed}
            onChange={onChangeStatusHandler}/>
        <EditableSpan title={props.task.title} onChange={onChangeTitleHandler}/>
        <IconButton aria-label="delete" onClick={onRemoveTaskHandler}>
            <Delete/>
        </IconButton>
    </div>

})