import {
    removeTask,
    updateTask
} from "../../tasks-reducer";
import React, {ChangeEvent, useCallback} from "react";
import {Checkbox, IconButton} from "@mui/material";
import {EditableSpan} from "../../../../components/EditableSpan/EditableSpan";
import {Delete} from "@mui/icons-material";
import {useDispatch} from "react-redux";
import {TaskStatuses, TaskType} from "../../../../api/todolists-api";

type TaskPropsType = {
    task: TaskType
    todoListId: string
};

export const Task = React.memo((props: TaskPropsType) => {
    const dispatch = useDispatch();
    const onRemoveTaskHandler = () => {
        dispatch<any>(removeTask( {todoListId: props.todoListId, taskId: props.task.id}))
    }
    const onChangeStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
        dispatch<any>(updateTask({
            todoListId: props.todoListId,
            taskId: props.task.id,
            domainModel: {status: e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New}}))
    }
    const onChangeTitleHandler = useCallback((newTitle: string) => {
        dispatch<any>(updateTask({todoListId: props.todoListId, taskId: props.task.id, domainModel: {title:newTitle}}))
    }, [dispatch, props.task.id, props.todoListId])

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