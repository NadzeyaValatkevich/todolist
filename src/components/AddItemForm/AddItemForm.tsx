import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {IconButton, TextField} from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'

export type AddItemFormSubmitHelperType = {setError: (error: string) => void, setTitle: (title: string) => void};
type AddItemFormPropsType = {
    addItem: (title: string, helpers: {setError: (error: string) => void, setTitle: (title: string) => void}) => void,
    disabled?: boolean
};

export const AddItemForm = React.memo(({addItem, disabled = false}: AddItemFormPropsType) => {
    const [title, setTitle] = useState('');
    const [error, setError] = useState<string | null>(null);

    const addTask = async () => {
        if (title.trim() !== '') {
            addItem(title, {setError, setTitle});
        } else {
            setError('Title is required')
        }
    };

    const onNewTitleChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    };

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if(error !== null) {
            setError(null)
        }
        if (e.charCode === 13) {
            addTask()
            // addItem(title)
            // setTitle('')
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