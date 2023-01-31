import {createAction} from "@reduxjs/toolkit";

const setStatus = createAction<{status: 'idle' | 'loading' | 'succeeded' | 'failed'}>('app/setStatus');
const setError = createAction<{error: string | null}>('app/setError');

export const appActions = {
    setStatus,
    setError
};