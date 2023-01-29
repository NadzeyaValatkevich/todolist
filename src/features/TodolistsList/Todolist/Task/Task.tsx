import React, {ChangeEvent, useCallback} from "react";
import {Checkbox, IconButton} from "@mui/material";
import {EditableSpan} from "../../../../components/EditableSpan/EditableSpan";
import {Delete} from "@mui/icons-material";
import {useDispatch} from "react-redux";
import {TaskStatuses, TaskType} from "../../../../api/todolists-api";
import {bindActionCreators} from "redux";
import {tasksActions} from "../../index";
import {useActions} from "../../../../app/store";

type TaskPropsType = {
    task: TaskType
    todoListId: string
};

export const Task = React.memo((props: TaskPropsType) => {
    const {removeTask, updateTask} = useActions(tasksActions);

    const onRemoveTaskHandler = useCallback(() => {
        removeTask({todoListId: props.todoListId, taskId: props.task.id})
    }, [props.task.id, props.todoListId]);

    const onChangeStatusHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        updateTask({
            todoListId: props.todoListId,
            taskId: props.task.id,
            domainModel: {status: e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New}
        })
    }, [props.task.id, props.todoListId]);

    const onChangeTitleHandler = useCallback((newTitle: string) => {
        updateTask({todoListId: props.todoListId, taskId: props.task.id, domainModel: {title: newTitle}})
    }, [props.task.id, props.todoListId]);

    return <div key={props.task.id}
                className={props.task.status === TaskStatuses.Completed ? 'is-done' : ''}
                style={{position: 'relative'}}
    >
        <Checkbox
            checked={props.task.status === TaskStatuses.Completed}
            onChange={onChangeStatusHandler}/>
        <EditableSpan title={props.task.title} onChange={onChangeTitleHandler}/>
        <IconButton size={'small'} aria-label="delete" onClick={onRemoveTaskHandler} style={{position: 'absolute', top: '2px', right: '2px'}}>
            <Delete fontSize={'small'}/>
        </IconButton>
    </div>
})