import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {Button} from "@mui/material";

type AddItemFormPropsType = {
    addItem: (title: string) => void
}

export const AddItemForm = (props: AddItemFormPropsType) => {
    const [title, setNewTaskTitle] = useState('')
    const [error, setError] = useState<string | null>(null)

    const onNewTitleChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setNewTaskTitle(e.currentTarget.value)
    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        setError(null)
        if (e.charCode === 13) {
            props.addItem(title)
            setNewTaskTitle('')
        }
    }

    const addTask = () => {
        if (title.trim() !== '') {
            props.addItem(title)
            setNewTaskTitle('')
        } else {
            setError('Title is required')
        }
    }

    return <div>
        <input value={title}
               onChange={onNewTitleChangeHandler}
               onKeyPress={onKeyPressHandler}
               className={error ? 'error' : ''}
        />
        <Button onClick={addTask} variant={'contained'} color={'primary'}>+</Button>
        {error && <div className={'error-message'}>{error}</div>}
    </div>
}