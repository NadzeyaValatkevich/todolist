import {authApi} from "../api/todolists-api";
import {setIsLoggedInAC} from "../features/Auth/auth-reducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

type InitialStateType = {
    status: 'idle' | 'loading' | 'succeeded' | 'failed',
    error: string | null,
    isInitialized: boolean
};

const initializeApp = createAsyncThunk('app/initializeApp', async (param, {dispatch}) => {
    const res = await authApi.me();
    if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC({value: true}))
    }
});

export const asyncActions = {
    initializeApp
};

const slice = createSlice({
    name: 'app',
    initialState: {
        error: null,
        status: 'idle',
        isInitialized: false
    } as InitialStateType,
    reducers: {
        setErrorAC(state, action: PayloadAction<{ error: string | null }>) {
            state.error = action.payload.error
        },
        setStatusAC(state, action: PayloadAction<{ status: 'idle' | 'loading' | 'succeeded' | 'failed' }>) {
            state.status = action.payload.status
        },
        setAppInitializedAC(state, action: PayloadAction<{ isInitialized: boolean }>) {
            state.isInitialized = action.payload.isInitialized
        }
    },
    extraReducers: builder => {
        builder.addCase(initializeApp.fulfilled, (state) => {
            state.isInitialized = true
        })
    }
});

export const appReducer = slice.reducer;
export const {setErrorAC, setStatusAC} = slice.actions;
export type RequestStatusType = {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
};
