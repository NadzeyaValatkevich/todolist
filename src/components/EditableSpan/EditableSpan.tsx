import React, {ChangeEvent, useState} from "react";
import {TextField} from "@mui/material";

type EditableSpanPropsType = {
    title: string
    onChange: (title: string) => void
}
export const EditableSpan = React.memo((props: EditableSpanPropsType) => {
    const [editMode, setEditMode] = useState(false)
    const [title, setTitle] = useState('')

    const activateEditMode = () => {
        setEditMode(true)
        setTitle(props.title)
    }
    const activateViewMode = () => {
        setEditMode(false)
        props.onChange(title)
    }

    const onChangeTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }
    return (
        editMode
            ? <TextField value={title} variant={'standard'} onChange={onChangeTitleHandler} onBlur={activateViewMode} autoFocus/>
            : <span onDoubleClick={activateEditMode}>{props.title}</span>
    )
})