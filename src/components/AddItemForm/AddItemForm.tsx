import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {Button, IconButton, TextField} from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'

type AddItemFormPropsType = {
    addItem: (title: string) => Promise<any>,
    disabled?: boolean
}

export const AddItemForm = React.memo(({addItem, disabled = false}: AddItemFormPropsType) => {
    const [title, setNewTaskTitle] = useState('')
    const [error, setError] = useState<string | null>(null)

    const onNewTitleChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setNewTaskTitle(e.currentTarget.value)
    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if(error !== null) {
            setError(null)
        }
        if (e.charCode === 13) {
            addItem(title)
            setNewTaskTitle('')
        }
    };

    const addTask = async () => {
        if (title.trim() !== '') {
            try {
                await addItem(title);
                setNewTaskTitle('')
            } catch (error: any) {
                setError(error)
            }
        } else {
            setError('Title is required')
        }
    };

    return <div>
        <TextField
            disabled={disabled}
            variant={'outlined'}
            label={'Type value'}
            value={title}
            onChange={onNewTitleChangeHandler}
            onKeyPress={onKeyPressHandler}
            error={!!error}
            helperText={error}
        />
        <IconButton onClick={addTask} color={'primary'} disabled={disabled} style={{marginLeft: '5px'}}>
            <AddCircleOutlineIcon/>
        </IconButton>
    </div>
} );